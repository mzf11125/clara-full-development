;; koperasi-governor.clar
;; Enhanced on-chain governor for the koperasi with weighted voting based on simpanan
;; Replace constants with deployed principals after deployment.

(define-constant MEMBERSHIP_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace after deploy
(define-constant GOVTOKEN_CONTRACT 'SP000000000000000000002Q6VF78)   ;; replace with governance-token principal
(define-constant TREASURY_CONTRACT 'SP000000000000000000002Q6VF78)    ;; replace with treasury principal
(define-constant LOAN_CONTRACT 'SP000000000000000000002Q6VF78)        ;; replace with loan-manager principal
(define-constant PROFIT_CONTRACT 'SP000000000000000000002Q6VF78)      ;; replace with profit-sharing principal

;; Enhanced proposal actions types:
;; 1 = TREASURY_SEND (target principal = recipient; amount uint)
;; 2 = APPROVE_LOAN (target = loan id as uint; amount unused)
;; 3 = PROFIT_DISTRIBUTION_TRIGGER (target = unused; amount = unused)
;; 4 = UPDATE_INTEREST_RATE (target = unused; amount = new rate)
;; 5 = CHANGE_QUORUM (target = unused; amount = new quorum percentage)
;; 6 = EMERGENCY_PAUSE (target = contract to pause; amount = unused)

(define-map proposals
  ((id uint))
  ((proposer principal)
   (action-type uint)       ;; 1,2,3,4,5,6
   (target principal)       ;; target recipient or contract address
   (num-arg uint)           ;; amount or parameter value
   (description (buff 512))
   (yes-votes uint)         ;; weighted by simpanan
   (no-votes uint)          ;; weighted by simpanan
   (start-block uint)
   (end-block uint)
   (executed bool)
   (total-voting-power uint))) ;; total simpanan at proposal creation

;; Track member voting to prevent double voting
(define-map member-votes
  ((proposal-id uint) (voter principal))
  ((voted bool)
   (support bool)
   (voting-power uint)))

(define-data-var proposal-count uint u0)
(define-data-var voting-period uint u1008) ;; ~1 week in blocks
(define-data-var quorum-percentage uint u30) ;; 30% of total simpanan
(define-data-var min-delay uint u144) ;; ~1 day wait after voting to execute
(define-data-var min-proposal-threshold uint u1000000) ;; minimum simpanan to propose (1M micro-STX)

;; Create a proposal with simpanan-based eligibility check
(define-public (propose (action-type uint) (target principal) (num-arg uint) (description (buff 512)))
  (let ((pid (+ (var-get proposal-count) u1))
        (now block-height))
    ;; Check if proposer has sufficient simpanan
    (match (contract-call? MEMBERSHIP_CONTRACT get-member tx-sender)
      member-data
      (let ((simpanan (get simpanan member-data))
            (total-simpanan (unwrap-panic (contract-call? MEMBERSHIP_CONTRACT get-total-simpanan))))
        (begin
          (asserts! (>= simpanan (var-get min-proposal-threshold)) (err u600)) ;; insufficient simpanan
          
          (map-set proposals ((id pid))
            ((proposer tx-sender)
             (action-type action-type)
             (target target)
             (num-arg num-arg)
             (description description)
             (yes-votes u0)
             (no-votes u0)
             (start-block now)
             (end-block (+ now (var-get voting-period)))
             (executed false)
             (total-voting-power total-simpanan)))
          (var-set proposal-count pid)
          (ok pid)))
      (err u601)))) ;; not a member

;; Enhanced voting with simpanan-based weight
(define-public (vote (id uint) (support bool))
  (let ((now block-height))
    (match (map-get? proposals ((id id)))
      prop
      (let ((end (get end-block prop)))
        (begin
          ;; Check voting period
          (asserts! (< now end) (err u500)) ;; voting ended
          
          ;; Check if already voted
          (asserts! (is-none (map-get? member-votes ((proposal-id id) (voter tx-sender)))) (err u502)) ;; already voted
          
          ;; Get member's simpanan (voting power)
          (match (contract-call? MEMBERSHIP_CONTRACT get-member tx-sender)
            member-data
            (let ((voting-power (get simpanan member-data)))
              (begin
                ;; Record the vote
                (map-set member-votes ((proposal-id id) (voter tx-sender))
                  ((voted true) (support support) (voting-power voting-power)))
                
                ;; Update proposal vote counts
                (if support
                    (map-set proposals ((id id))
                      ((proposer (get proposer prop))
                       (action-type (get action-type prop))
                       (target (get target prop))
                       (num-arg (get num-arg prop))
                       (description (get description prop))
                       (yes-votes (+ (get yes-votes prop) voting-power))
                       (no-votes (get no-votes prop))
                       (start-block (get start-block prop))
                       (end-block (get end-block prop))
                       (executed (get executed prop))
                       (total-voting-power (get total-voting-power prop))))
                    (map-set proposals ((id id))
                      ((proposer (get proposer prop))
                       (action-type (get action-type prop))
                       (target (get target prop))
                       (num-arg (get num-arg prop))
                       (description (get description prop))
                       (yes-votes (get yes-votes prop))
                       (no-votes (+ (get no-votes prop) voting-power))
                       (start-block (get start-block prop))
                       (end-block (get end-block prop))
                       (executed (get executed prop))
                       (total-voting-power (get total-voting-power prop)))))
                (ok true)))
            (err u503)))) ;; not a member
      (err u501)))) ;; proposal not found

;; Enhanced quorum calculation based on total simpanan
(define-read-only (get-quorum-threshold (proposal-id uint))
  (match (map-get? proposals ((id proposal-id)))
    prop
    (let ((total-power (get total-voting-power prop)))
      (ok (/ (* total-power (var-get quorum-percentage)) u100)))
    (err u510)))

(define-read-only (get-proposal-result (id uint))
  (match (map-get? proposals ((id id)))
    prop
    (let ((yes-v (get yes-votes prop))
          (no-v (get no-votes prop))
          (total-voted (+ yes-v no-v))
          (quorum-needed (unwrap-panic (get-quorum-threshold id))))
      (ok { 
        yes-votes: yes-v, 
        no-votes: no-v, 
        total-voted: total-voted, 
        quorum-needed: quorum-needed,
        passed: (and (> yes-v no-v) (>= total-voted quorum-needed))
      }))
    (err u502)))

;; Enhanced execution with new action types
(define-public (execute (id uint) (extra-list (list 100 principal)) (extra-amounts (list 100 uint)))
  (let ((now block-height))
    (match (map-get? proposals ((id id)))
      prop
      (let ((end (get end-block prop)))
        (begin
          ;; Check timing and execution status
          (asserts! (>= now (+ end (var-get min-delay))) (err u521)) ;; too early
          (asserts! (not (get executed prop)) (err u522)) ;; already executed
          
          ;; Check if proposal passed
          (match (get-proposal-result id)
            result-data
            (begin
              (asserts! (get passed result-data) (err u520)) ;; proposal failed
              
              ;; Execute based on action type
              (match (get action-type prop)
                u1 ;; TREASURY_SEND
                (let ((recipient (get target prop)) (amt (get num-arg prop)))
                  (match (contract-call? TREASURY_CONTRACT send-funds recipient amt)
                    (ok res) (mark-executed id)
                    (err e) (err u530)))
                
                u2 ;; APPROVE_LOAN
                (let ((loan-id (get num-arg prop)))
                  (match (contract-call? LOAN_CONTRACT approve-loan loan-id)
                    (ok res) (mark-executed id)
                    (err e) (err u531)))
                
                u3 ;; PROFIT_DISTRIBUTION
                (match (contract-call? PROFIT_CONTRACT distribute extra-list extra-amounts)
                  (ok res) (mark-executed id)
                  (err e) (err u540))
                
                u4 ;; UPDATE_INTEREST_RATE
                (let ((new-rate (get num-arg prop)))
                  (match (contract-call? LOAN_CONTRACT set-base-interest-rate new-rate)
                    (ok res) (mark-executed id)
                    (err e) (err u550)))
                
                u5 ;; CHANGE_QUORUM
                (let ((new-quorum (get num-arg prop)))
                  (begin
                    (var-set quorum-percentage new-quorum)
                    (mark-executed id)))
                
                u6 ;; EMERGENCY_PAUSE
                (let ((contract-to-pause (get target prop)))
                  (match (contract-call? contract-to-pause emergency-pause)
                    (ok res) (mark-executed id)
                    (err e) (err u560)))
                
                ;; Default case
                (err u599))) ;; unsupported action
            (err e) (err e))))
      (err u502)))) ;; proposal not found

;; Helper function to mark proposal as executed
(define-private (mark-executed (proposal-id uint))
  (match (map-get? proposals ((id proposal-id)))
    prop
    (begin
      (map-set proposals ((id proposal-id))
        ((proposer (get proposer prop))
         (action-type (get action-type prop))
         (target (get target prop))
         (num-arg (get num-arg prop))
         (description (get description prop))
         (yes-votes (get yes-votes prop))
         (no-votes (get no-votes prop))
         (start-block (get start-block prop))
         (end-block (get end-block prop))
         (executed true)
         (total-voting-power (get total-voting-power prop))))
      (ok true))
    (err u502)))

;; Read-only functions for member voting info
(define-read-only (get-member-vote (proposal-id uint) (voter principal))
  (map-get? member-votes ((proposal-id proposal-id) (voter voter))))

(define-read-only (get-proposal (id uint))
  (map-get? proposals ((id id))))
