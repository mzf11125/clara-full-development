;; koperasi-governor.clar
;; Enhanced on-chain governor for the koperasi with weighted voting based on simpanan

(define-constant MEMBERSHIP_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.Membership)
(define-constant GOVTOKEN_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.GovernanceToken)
(define-constant TREASURY_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.Treasury)
(define-constant LOAN_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.LoanManager)
(define-constant PROFIT_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.ProfitSharing)

;; Proposal actions:
;; 1 = TREASURY_SEND
;; 2 = APPROVE_LOAN
;; 3 = PROFIT_DISTRIBUTION_TRIGGER
;; 4 = UPDATE_INTEREST_RATE
;; 5 = CHANGE_QUORUM
;; 6 = EMERGENCY_PAUSE

(define-map proposals
  {id: uint}
  {proposer: principal,
   action-type: uint,
   target: principal,
   num-arg: uint,
   description: (buff 512),
   yes-votes: uint,
   no-votes: uint,
   start-time: uint,
   end-time: uint,
   executed: bool,
   total-voting-power: uint})

(define-map member-votes
  {proposal-id: uint, voter: principal}
  {voted: bool,
   support: bool,
   voting-power: uint})

(define-data-var proposal-count uint u0)
(define-data-var voting-period uint u1008)
(define-data-var quorum-percentage uint u30)
(define-data-var proposal-delay uint u144)
(define-data-var proposal-threshold uint u1000000)
(define-data-var time-counter uint u0) ;; sequential counter instead of block-height

;; Helper function to get next sequential time
(define-private (get-next-time)
  (let ((next (+ (var-get time-counter) u1)))
    (var-set time-counter next)
    next))

;; Create a proposal
(define-public (propose (action-type uint) (target principal) (num-arg uint) (description (buff 512)))
  (let ((pid (+ (var-get proposal-count) u1))
        (now (get-next-time)))
    (match (contract-call? MEMBERSHIP_CONTRACT get-member tx-sender)
      member-data
      (let ((simpanan (get simpanan member-data)))
        (match (contract-call? MEMBERSHIP_CONTRACT get-total-simpanan)
          total-simpanan
          (begin
            (asserts! (>= simpanan (var-get proposal-threshold)) (err u600))
            (map-set proposals {id: pid}
              {proposer: tx-sender,
               action-type: action-type,
               target: target,
               num-arg: num-arg,
               description: description,
               yes-votes: u0,
               no-votes: u0,
               start-time: now,
               end-time: (+ now (var-get voting-period)),
               executed: false,
               total-voting-power: total-simpanan})
            (var-set proposal-count pid)
            (ok pid)))
          err-total (err err-total)))
      err-member (err err-member)))

;; Voting
(define-public (vote (id uint) (support bool))
  (let ((now (get-next-time)))
    (match (map-get? proposals {id: id})
      prop
      (let ((end (get end-time prop)))
        (begin
          (asserts! (< now end) (err u500))
          (asserts! (is-none (map-get? member-votes {proposal-id: id, voter: tx-sender})) (err u502))
          (match (contract-call? MEMBERSHIP_CONTRACT get-member tx-sender)
            member-data
            (let ((voting-power (get simpanan member-data)))
              (begin
                (map-set member-votes {proposal-id: id, voter: tx-sender}
                  {voted: true, support: support, voting-power: voting-power})
                (if support
                    (map-set proposals {id: id}
                      {proposer: (get proposer prop),
                       action-type: (get action-type prop),
                       target: (get target prop),
                       num-arg: (get num-arg prop),
                       description: (get description prop),
                       yes-votes: (+ (get yes-votes prop) voting-power),
                       no-votes: (get no-votes prop),
                       start-time: (get start-time prop),
                       end-time: (get end-time prop),
                       executed: (get executed prop),
                       total-voting-power: (get total-voting-power prop)})
                    (map-set proposals {id: id}
                      {proposer: (get proposer prop),
                       action-type: (get action-type prop),
                       target: (get target prop),
                       num-arg: (get num-arg prop),
                       description: (get description prop),
                       yes-votes: (get yes-votes prop),
                       no-votes: (+ (get no-votes prop) voting-power),
                       start-time: (get start-time prop),
                       end-time: (get end-time prop),
                       executed: (get executed prop),
                       total-voting-power: (get total-voting-power prop)}))
                (ok true)))
            err-member (err err-member))))
      err-proposal (err err-proposal))))

;; Quorum threshold
(define-read-only (get-quorum-threshold (proposal-id uint))
  (match (map-get? proposals {id: proposal-id})
    prop
    (ok (/ (* (get total-voting-power prop) (var-get quorum-percentage)) u100))
    (err u404)))

;; Proposal result
(define-read-only (get-proposal-result (id uint))
  (match (map-get? proposals {id: id})
    prop
    (let ((yes-v (get yes-votes prop))
          (no-v (get no-votes prop))
          (total-voted (+ (get yes-votes prop) (get no-votes prop))))
      (match (get-quorum-threshold id)
        quorum-needed
        (ok {
          yes-votes: yes-v,
          no-votes: no-v,
          total-voted: total-voted,
          quorum-needed: quorum-needed,
          passed: (and (> yes-v no-v) (>= total-voted quorum-needed))
        })
        err-q (err err-q)))
    err-proposal (err err-proposal)))

;; Execute proposal
(define-public (execute (id uint) (extra-list (list 100 principal)) (extra-amounts (list 100 uint)))
  (let ((now (get-next-time)))
    (match (map-get? proposals {id: id})
      prop
      (let ((end (get end-time prop)))
        (begin
          (asserts! (>= now (+ end (var-get proposal-delay))) (err u521))
          (asserts! (not (get executed prop)) (err u522))
          (match (get-proposal-result id)
            result-data
            (begin
              (asserts! (get passed result-data) (err u520))
              (match (get action-type prop)
                u1 ;; TREASURY_SEND
                (let ((recipient (get target prop)) (amt (get num-arg prop)))
                  (match (contract-call? TREASURY_CONTRACT send-funds recipient amt)
                    ok-call (mark-executed id)
                    err-call (err u530)))
                u2 ;; APPROVE_LOAN
                (let ((loan-id (get num-arg prop)))
                  (match (contract-call? LOAN_CONTRACT approve-loan loan-id)
                    ok-call (mark-executed id)
                    err-call (err u531)))
                u3 ;; PROFIT_DISTRIBUTION
                (match (contract-call? PROFIT_CONTRACT distribute extra-list extra-amounts)
                  ok-call (mark-executed id)
                  err-call (err u540))
                u4 ;; UPDATE_INTEREST_RATE
                (let ((new-rate (get num-arg prop)))
                  (match (contract-call? LOAN_CONTRACT set-base-interest-rate new-rate)
                    ok-call (mark-executed id)
                    err-call (err u550)))
                u5 ;; CHANGE_QUORUM
                (let ((new-quorum (get num-arg prop)))
                  (begin
                    (var-set quorum-percentage new-quorum)
                    (mark-executed id)))
                u6 ;; EMERGENCY_PAUSE
                (let ((contract-to-pause (get target prop)))
                  (match (contract-call? contract-to-pause emergency-pause)
                    ok-call (mark-executed id)
                    err-call (err u560)))
                (err u599)))
            err-result (err err-result))))
      err-proposal (err err-proposal))))

;; Mark proposal executed
(define-private (mark-executed (proposal-id uint))
  (match (map-get? proposals {id: proposal-id})
    prop
    (begin
      (map-set proposals {id: proposal-id}
        {proposer: (get proposer prop),
         action-type: (get action-type prop),
         target: (get target prop),
         num-arg: (get num-arg prop),
         description: (get description prop),
         yes-votes: (get yes-votes prop),
         no-votes: (get no-votes prop),
         start-time: (get start-time prop),
         end-time: (get end-time prop),
         executed: true,
         total-voting-power: (get total-voting-power prop)})
      (ok true))
    err-proposal (err err-proposal)))

;; Read-only views
(define-read-only (get-member-vote (proposal-id uint) (voter principal))
  (map-get? member-votes {proposal-id: proposal-id, voter: voter}))

(define-read-only (get-proposal (id uint))
  (map-get? proposals {id: id}))