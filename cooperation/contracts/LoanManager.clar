;; loan-manager.clar
;; Enhanced loan request registry with repayment tracking, interest calculation, and credit scoring.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace after deployment
(define-constant TREASURY_CONTRACT 'SP000000000000000000002Q6VF78)
(define-constant MEMBERSHIP_CONTRACT 'SP000000000000000000002Q6VF78)

;; Error constants
(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_LOAN_NOT_FOUND (err u301))
(define-constant ERR_ALREADY_APPROVED (err u302))
(define-constant ERR_NOT_APPROVED (err u303))
(define-constant ERR_INSUFFICIENT_PAYMENT (err u304))
(define-constant ERR_LOAN_DEFAULTED (err u305))

;; Loan statuses
(define-constant LOAN_PENDING u0)
(define-constant LOAN_APPROVED u1)
(define-constant LOAN_ACTIVE u2)
(define-constant LOAN_COMPLETED u3)
(define-constant LOAN_DEFAULTED u4)

;; Interest rate
(define-data-var base-interest-rate uint u1200) ;; 12% annual
(define-data-var default-threshold-blocks uint u2016) ;; ~2 weeks in time units
(define-data-var time-counter uint u0) ;; sequential counter instead of block-height

;; Helper function to get next sequential time
(define-private (get-next-time)
  (let ((next (+ (var-get time-counter) u1)))
    (var-set time-counter next)
    next))

;; Maps
(define-map loans
  uint  ;; Changed from ((id uint)) to just uint
  { requester: principal,
    amount: uint,
    purpose: (buff 256),
    interest-rate: uint,
    total-amount: uint,
    status: uint,
    approved-at: uint,
    disbursed-at: uint,
    due-date: uint,
    monthly-payment: uint })

(define-map loan-repayments
  uint  ;; Changed from ((id uint)) to just uint
  { total-paid: uint,
    last-payment-block: uint,
    payment-count: uint,
    remaining-balance: uint })

(define-map member-credit
  principal  ;; Changed from ((member principal)) to just principal
  { credit-score: uint,
    total-loans: uint,
    completed-loans: uint,
    defaulted-loans: uint,
    total-borrowed: uint,
    total-repaid: uint,
    avg-payment-delay: uint })

(define-data-var loan-count uint u0)

(define-public (request-loan (amount uint) (purpose (buff 256)) (duration-months uint))
  (let (
        (id (+ (var-get loan-count) u1))
        (credit-info (default-to 
          { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0, 
            total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
          (map-get? member-credit tx-sender)))  ;; Fixed map key
        (adjusted-rate (calculate-interest-rate (get credit-score credit-info)))
        (total-with-interest (calculate-total-amount amount adjusted-rate duration-months))
        (monthly-payment (/ total-with-interest duration-months))
       )
    (begin
      (map-set loans id  ;; Fixed map key
        { requester: tx-sender,
          amount: amount,
          purpose: purpose,
          interest-rate: adjusted-rate,
          total-amount: total-with-interest,
          status: LOAN_PENDING,
          approved-at: u0,
          disbursed-at: u0,
          due-date: u0,
          monthly-payment: monthly-payment })
      
      (map-set loan-repayments id  ;; Fixed map key
        { total-paid: u0,
          last-payment-block: u0,
          payment-count: u0,
          remaining-balance: total-with-interest })
      
      (var-set loan-count id)
      (ok id)
    )))

;; Interest Rate Calc
(define-private (calculate-interest-rate (credit-score uint))
  (if (>= credit-score u750)
      (var-get base-interest-rate)
      (if (>= credit-score u650)
          (+ (var-get base-interest-rate) u200)
          (+ (var-get base-interest-rate) u400))))

;; Total Amount Calc (simple interest)
(define-private (calculate-total-amount (principal uint) (annual-rate uint) (months uint))
  (+ principal (/ (* principal annual-rate months) (* u100 u12))))

;; =========================
;; Approve Loan
;; =========================
(define-public (approve-loan (loan-id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans loan-id)  ;; Fixed map key
      loan-data
      (let ((current-time (get-next-time))
            (due-time (+ current-time (* u30 u144))))
        (map-set loans loan-id  ;; Fixed map key
          { requester: (get requester loan-data),
            amount: (get amount loan-data),
            purpose: (get purpose loan-data),
            interest-rate: (get interest-rate loan-data),
            total-amount: (get total-amount loan-data),
            status: LOAN_APPROVED,
            approved-at: current-time,
            disbursed-at: u0,
            due-date: due-time,
            monthly-payment: (get monthly-payment loan-data) })
        (ok true))
      ERR_LOAN_NOT_FOUND)))

;; =========================
;; Disburse Loan
;; =========================
(define-public (disburse-loan (loan-id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans loan-id)  ;; Fixed map key
      loan-data
      (begin
        (asserts! (is-eq (get status loan-data) LOAN_APPROVED) ERR_NOT_APPROVED)
        (map-set loans loan-id  ;; Fixed map key
          { requester: (get requester loan-data),
            amount: (get amount loan-data),
            purpose: (get purpose loan-data),
            interest-rate: (get interest-rate loan-data),
            total-amount: (get total-amount loan-data),
            status: LOAN_ACTIVE,
            approved-at: (get approved-at loan-data),
            disbursed-at: (get-next-time),
            due-date: (get due-date loan-data),
            monthly-payment: (get monthly-payment loan-data) })
        
        (update-member-credit (get requester loan-data) (get amount loan-data) false)
        (ok true))
      ERR_LOAN_NOT_FOUND)))

;; =========================
;; Make Repayment
;; =========================
(define-public (make-repayment (loan-id uint) (amount uint))
  (match (map-get? loans loan-id)  ;; Fixed map key
    loan-data
    (begin
      (asserts! (is-eq tx-sender (get requester loan-data)) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get status loan-data) LOAN_ACTIVE) ERR_NOT_APPROVED)
      
      (match (map-get? loan-repayments loan-id)  ;; Fixed map key
        repayment-data
        (let ((new-total-paid (+ (get total-paid repayment-data) amount))
              (new-remaining (if (>= (get remaining-balance repayment-data) amount)
                                 (- (get remaining-balance repayment-data) amount)
                                 u0))
              (new-payment-count (+ (get payment-count repayment-data) u1)))
          
          (map-set loan-repayments loan-id  ;; Fixed map key
            { total-paid: new-total-paid,
              last-payment-block: (get-next-time),
              payment-count: new-payment-count,
              remaining-balance: new-remaining })
          
          (if (<= new-remaining u0)
              (begin
                (map-set loans loan-id  ;; Fixed map key
                  { requester: (get requester loan-data),
                    amount: (get amount loan-data),
                    purpose: (get purpose loan-data),
                    interest-rate: (get interest-rate loan-data),
                    total-amount: (get total-amount loan-data),
                    status: LOAN_COMPLETED,
                    approved-at: (get approved-at loan-data),
                    disbursed-at: (get disbursed-at loan-data),
                    due-date: (get due-date loan-data),
                    monthly-payment: (get monthly-payment loan-data) })
                
                (update-member-credit (get requester loan-data) amount true)
                (ok true))
              (ok true)))
        ERR_LOAN_NOT_FOUND))
    ERR_LOAN_NOT_FOUND))

;; =========================
;; Update Credit
;; =========================
(define-private (update-member-credit (member principal) (amount uint) (is-completion bool))
  (let ((current-credit (default-to 
          { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0,
            total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
          (map-get? member-credit member))))  ;; Fixed map key
    (if is-completion
        (map-set member-credit member  ;; Fixed map key
          { credit-score: (let ((new-score (+ (get credit-score current-credit) u10)))
                            (if (> new-score u850) u850 new-score)),
            total-loans: (get total-loans current-credit),
            completed-loans: (+ (get completed-loans current-credit) u1),
            defaulted-loans: (get defaulted-loans current-credit),
            total-borrowed: (get total-borrowed current-credit),
            total-repaid: (+ (get total-repaid current-credit) amount),
            avg-payment-delay: (get avg-payment-delay current-credit) })
        (map-set member-credit member  ;; Fixed map key
          { credit-score: (get credit-score current-credit),
            total-loans: (+ (get total-loans current-credit) u1),
            completed-loans: (get completed-loans current-credit),
            defaulted-loans: (get defaulted-loans current-credit),
            total-borrowed: (+ (get total-borrowed current-credit) amount),
            total-repaid: (get total-repaid current-credit),
            avg-payment-delay: (get avg-payment-delay current-credit) }))))

;; =========================
;; Mark Default
;; =========================
(define-public (mark-default (loan-id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans loan-id)  ;; Fixed map key
      loan-data
      (begin
        (asserts! (> (get-next-time) (+ (get due-date loan-data) (var-get default-threshold-blocks))) ERR_UNAUTHORIZED)
        
        (map-set loans loan-id  ;; Fixed map key
          { requester: (get requester loan-data),
            amount: (get amount loan-data),
            purpose: (get purpose loan-data),
            interest-rate: (get interest-rate loan-data),
            total-amount: (get total-amount loan-data),
            status: LOAN_DEFAULTED,
            approved-at: (get approved-at loan-data),
            disbursed-at: (get disbursed-at loan-data),
            due-date: (get due-date loan-data),
            monthly-payment: (get monthly-payment loan-data) })
        
        (let ((current-credit (default-to 
                { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0,
                  total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
                (map-get? member-credit (get requester loan-data)))))  ;; Fixed map key
          (map-set member-credit (get requester loan-data)  ;; Fixed map key
            { credit-score: (if (>= (get credit-score current-credit) u50)
                                (- (get credit-score current-credit) u50)
                                u300),  ;; Fixed max/min issue
              total-loans: (get total-loans current-credit),
              completed-loans: (get completed-loans current-credit),
              defaulted-loans: (+ (get defaulted-loans current-credit) u1),
              total-borrowed: (get total-borrowed current-credit),
              total-repaid: (get total-repaid current-credit),
              avg-payment-delay: (get avg-payment-delay current-credit) }))
        (ok true))
      ERR_LOAN_NOT_FOUND)))

;; =========================
;; Read-only functions
;; =========================
(define-read-only (get-loan (loan-id uint))
  (map-get? loans loan-id))  ;; Fixed map key

(define-read-only (get-loan-repayments (loan-id uint))
  (map-get? loan-repayments loan-id))  ;; Fixed map key

(define-read-only (get-member-credit (member principal))
  (map-get? member-credit member))  ;; Fixed map key

(define-read-only (get-credit-score (member principal))
  (match (map-get? member-credit member)  ;; Fixed map key
    credit-data (ok (get credit-score credit-data))
    (ok u650)))