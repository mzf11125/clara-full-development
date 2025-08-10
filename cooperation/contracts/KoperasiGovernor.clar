;; koperasi-governor.clar
;; Minimal on-chain governor for the koperasi
;; Replace constants MEMBERSHIP_CONTRACT, GOVTOKEN_CONTRACT, TREASURY_CONTRACT, LOAN_CONTRACT, PROFIT_CONTRACT with deployed principals.

(define-constant MEMBERSHIP_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace after deploy
(define-constant GOVTOKEN_CONTRACT 'SP000000000000000000002Q6VF78)   ;; replace with governance-token principal
(define-constant TREASURY_CONTRACT 'SP000000000000000000002Q6VF78)    ;; replace with treasury principal
(define-constant LOAN_CONTRACT 'SP000000000000000000002Q6VF78)        ;; replace with loan-manager principal
(define-constant PROFIT_CONTRACT 'SP000000000000000000002Q6VF78)      ;; replace with profit-sharing principal

;; Simple proposal actions types:
;; 1 = TREASURY_SEND (target principal = recipient; amount uint)
;; 2 = APPROVE_LOAN (target = loan id as uint; amount unused)
;; 3 = PROFIT_DISTRIBUTION_TRIGGER (target = unused; amount = unused) -> will call profit-sharing object's distribute via governor (we expect off-chain prepared list)
;; NOTE: For complex execution, you can extend this record.

(define-map proposals
  ((id uint))
  ((proposer principal)
   (action-type uint)       ;; 1,2,3
   (target principal)       ;; target recipient or unused (principal)
   (num-arg uint)           ;; amount (for action-type 1) or loan id (for 2)
   (description (buff 512))
   (yes uint)
   (no uint)
   (start-block uint)
   (end-block uint)
   (executed bool)))

(define-data-var proposal-count uint u0)
(define-data-var voting-period uint u100) ;; e.g., 100 blocks
(define-data-var quorum-percentage uint u20) ;; 20% quorum (naive)
(define-data-var min-delay uint u0) ;; blocks wait after voting to execute

;; Create a proposal
(define-public (propose (action-type uint) (target principal) (num-arg uint) (description (buff 512)))
  (let ((pid (+ (var-get proposal-count) u1))
        (now (unwrap-panic (get-block-info? block-height))))
    (begin
      (map-set proposals ((id pid))
        ((proposer tx-sender)
         (action-type action-type)
         (target target)
         (num-arg num-arg)
         (description description)
         (yes u0)
         (no u0)
         (start-block now)
         (end-block (+ now (var-get voting-period)))
         (executed false)))
      (var-set proposal-count pid)
      (ok pid))))

(define-public (vote (id uint) (support bool))
  (let ((now (unwrap-panic (get-block-info? block-height))))
    (match (map-get proposals ((id id)))
      prop
      (let ((end (get end-block prop)))
        (if (< now end)
            (begin
              ;; query governance token balance of voter
              (match (contract-call? GOVTOKEN_CONTRACT get-balance tx-sender)
                (ok bal)
                (let ((bal-u (as-max-uint bal)))
                  (if (is-eq support true)
                      (map-set proposals ((id id))
                        ((proposer (get proposer prop)) (action-type (get action-type prop)) (target (get target prop)) (num-arg (get num-arg prop)) (description (get description prop)) (yes (+ (get yes prop) bal-u)) (no (get no prop)) (start-block (get start-block prop)) (end-block (get end-block prop)) (executed (get executed prop))))
                      (map-set proposals ((id id))
                        ((proposer (get proposer prop)) (action-type (get action-type prop)) (target (get target prop)) (num-arg (get num-arg prop)) (description (get description prop)) (yes (get yes prop) (no (+ (get no prop) bal-u))) (start-block (get start-block prop)) (end-block (get end-block prop)) (executed (get executed prop)))))
                  (ok true)))
                (err u501)))
            (err u500))))
      (err u502))))

;; Simple helper to compute quorum threshold (naive): quorum = membership_count * quorum_percentage / 100
(define-read-only (get-quorum-threshold)
  (match (contract-call? MEMBERSHIP_CONTRACT get-membership-count)
    (ok mc)
    (ok (/ (* mc (var-get quorum-percentage)) u100))
    (err u510)))

(define-read-only (get-proposal-result (id uint))
  (match (map-get proposals ((id id)))
    prop
    (let ((yes-v (get yes prop))
          (no-v (get no prop)))
      (let ((total (+ yes-v no-v)))
        (ok { yes: yes-v, no: no-v, total: total, passed: (and (>= yes-v no-v) (>= yes-v (unwrap-panic (get-quorum-threshold)))) })))
    (err u502)))

;; Execute proposals (only allowed after end-block + min-delay and not executed)
(define-public (execute (id uint) (extra-list (list 100 principal)) (extra-amounts (list 100 uint)))
  ;; extra_list and amounts are optional data needed for complex exection like profit distribution recipients; for simple treasury send not needed
  (let ((now (unwrap-panic (get-block-info? block-height))))
    (match (map-get proposals ((id id)))
      prop
      (let ((end (get end-block prop)))
        (if (and (>= now (+ end (var-get min-delay))) (is-eq (get executed prop) false))
            (let ((yes-v (get yes prop))
                  (no-v (get no prop)))
              (let ((passed (and (>= yes-v no-v) (>= yes-v (unwrap-panic (get-quorum-threshold))))))

                (if (not passed)
                    (err u520) ;; not-passed
                    ;; passed: perform action
                    (let ((atype (get action-type prop)))
                      (begin
                        (match atype
                          u1 ;; TREASURY_SEND -> target principal = recipient, num-arg = amount
                          (let ((recipient (get target prop)) (amt (get num-arg prop)))
                            (match (contract-call? TREASURY_CONTRACT send-funds recipient amt)
                              (ok res)
                              (begin
                                (map-set proposals ((id id))
                                  ((proposer (get proposer prop)) (action-type atype) (target (get target prop)) (num-arg (get num-arg prop)) (description (get description prop)) (yes (get yes prop)) (no (get no prop)) (start-block (get start-block prop)) (end-block (get end-block prop)) (executed true)))
                                (ok true))
                              (err u530))))

                          u2 ;; APPROVE_LOAN -> num-arg = loan id
                          (let ((loan-id (get num-arg prop)))
                            (match (contract-call? LOAN_CONTRACT approve-loan loan-id)
                              (ok res)
                              (begin
                                ;; optionally execute payment if loan-manager triggers treasury send, or governor triggers separate treasury call later
                                (map-set proposals ((id id))
                                  ((proposer (get proposer prop)) (action-type atype) (target (get target prop)) (num-arg (get num-arg prop)) (description (get description prop)) (yes (get yes prop)) (no (get no prop)) (start-block (get start-block prop)) (end-block (get end-block prop)) (executed true)))
                                (ok true))
                              (err u531))))

                          u3 ;; PROFIT DISTRIBUTION: call profit-sharing.distribute with extra lists
                          (let ((res (contract-call? PROFIT_CONTRACT distribute extra-list extra-amounts)))
                            (match res
                              (ok r)
                              (begin
                                (map-set proposals ((id id))
                                  ((proposer (get proposer prop)) (action-type atype) (target (get target prop)) (num-arg (get num-arg prop)) (description (get description prop)) (yes (get yes prop)) (no (get no prop)) (start-block (get start-block prop)) (end-block (get end-block prop)) (executed true)))
                                (ok true))
                              (err u540))))

                          ;; fallback: unsupported action
                          (err u550)
                        )
                      ))))
            (err u521)))) ;; cannot-execute
      (err u502))))
