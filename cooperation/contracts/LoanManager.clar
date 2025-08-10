;; loan-manager.clar
;; Enhanced loan request registry with repayment tracking, interest calculation, and credit scoring.
;; Replace GOVERNOR_CONTRACT constant after deployment.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with governor
(define-constant TREASURY_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with treasury
(define-constant MEMBERSHIP_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with membership

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

;; Interest rate (annual percentage, scaled by 100)
(define-data-var base-interest-rate uint u1200) ;; 12% annual
(define-data-var default-threshold-blocks uint u2016) ;; ~2 weeks in blocks

(define-map loans
  ((id uint))
  ((requester principal)
   (amount uint)
   (purpose (buff 256))
   (interest-rate uint)
   (total-amount uint) ;; amount + interest
   (status uint)
   (approved-at uint)
   (disbursed-at uint)
   (due-date uint)
   (monthly-payment uint)))

(define-map loan-repayments
  ((loan-id uint))
  ((total-paid uint)
   (last-payment-block uint)
   (payment-count uint)
   (remaining-balance uint)))

;; Credit scoring system
(define-map member-credit
  ((member principal))
  ((credit-score uint) ;; 300-850 scale
   (total-loans uint)
   (completed-loans uint)
   (defaulted-loans uint)
   (total-borrowed uint)
   (total-repaid uint)
   (avg-payment-delay uint)))

(define-data-var loan-count uint u0)

;; Request loan with enhanced credit check
(define-public (request-loan (amount uint) (purpose (buff 256)) (duration-months uint))
  (let ((id (+ (var-get loan-count) u1))
        (credit-info (default-to 
          { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0, 
            total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
          (map-get? member-credit ((member tx-sender)))))
        (adjusted-rate (calculate-interest-rate (get credit-score credit-info)))
        (total-with-interest (calculate-total-amount amount adjusted-rate duration-months))
        (monthly-payment (/ total-with-interest duration-months)))
    (begin
      (map-set loans ((id id)) 
        ((requester tx-sender) 
         (amount amount) 
         (purpose purpose)
         (interest-rate adjusted-rate)
         (total-amount total-with-interest)
         (status LOAN_PENDING)
         (approved-at u0)
         (disbursed-at u0)
         (due-date u0)
         (monthly-payment monthly-payment)))
      
      ;; Initialize repayment tracking
      (map-set loan-repayments ((loan-id id))
        ((total-paid u0)
         (last-payment-block u0)
         (payment-count u0)
         (remaining-balance total-with-interest)))
      
      (var-set loan-count id)
      (ok id))))

;; Calculate interest rate based on credit score
(define-private (calculate-interest-rate (credit-score uint))
  (if (>= credit-score u750)
      (var-get base-interest-rate) ;; Good credit: base rate
      (if (>= credit-score u650)
          (+ (var-get base-interest-rate) u200) ;; Fair credit: +2%
          (+ (var-get base-interest-rate) u400)))) ;; Poor credit: +4%

;; Calculate total amount with compound interest
(define-private (calculate-total-amount (principal uint) (annual-rate uint) (months uint))
  (let ((monthly-rate (/ annual-rate u1200)) ;; annual rate / 12 / 100
        (factor (+ u10000 monthly-rate))) ;; 1 + monthly rate (scaled)
    ;; Simple interest for now: principal * (1 + rate * time)
    (+ principal (/ (* principal annual-rate months) (* u100 u12)))))

;; Governor approves loan
(define-public (approve-loan (id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans ((id id)))
      loan-data
      (let ((current-block block-height)
            (due-block (+ current-block (* u30 u144)))) ;; ~30 days in blocks
        (map-set loans ((id id)) 
          ((requester (get requester loan-data))
           (amount (get amount loan-data))
           (purpose (get purpose loan-data))
           (interest-rate (get interest-rate loan-data))
           (total-amount (get total-amount loan-data))
           (status LOAN_APPROVED)
           (approved-at current-block)
           (disbursed-at u0)
           (due-date due-block)
           (monthly-payment (get monthly-payment loan-data))))
        (ok true))
      ERR_LOAN_NOT_FOUND))

;; Disburse loan funds
(define-public (disburse-loan (id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans ((id id)))
      loan-data
      (begin
        (asserts! (is-eq (get status loan-data) LOAN_APPROVED) ERR_NOT_APPROVED)
        ;; Update loan status to active
        (map-set loans ((id id))
          ((requester (get requester loan-data))
           (amount (get amount loan-data))
           (purpose (get purpose loan-data))
           (interest-rate (get interest-rate loan-data))
           (total-amount (get total-amount loan-data))
           (status LOAN_ACTIVE)
           (approved-at (get approved-at loan-data))
           (disbursed-at block-height)
           (due-date (get due-date loan-data))
           (monthly-payment (get monthly-payment loan-data))))
        
        ;; Update member credit history
        (update-member-credit (get requester loan-data) (get amount loan-data) false)
        (ok true))
      ERR_LOAN_NOT_FOUND))

;; Make loan repayment
(define-public (make-repayment (loan-id uint) (amount uint))
  (match (map-get? loans ((loan-id loan-id)))
    loan-data
    (begin
      (asserts! (is-eq tx-sender (get requester loan-data)) ERR_UNAUTHORIZED)
      (asserts! (is-eq (get status loan-data) LOAN_ACTIVE) ERR_NOT_APPROVED)
      
      (match (map-get? loan-repayments ((loan-id loan-id)))
        repayment-data
        (let ((new-total-paid (+ (get total-paid repayment-data) amount))
              (new-remaining (- (get remaining-balance repayment-data) amount))
              (new-payment-count (+ (get payment-count repayment-data) u1)))
          
          ;; Update repayment tracking
          (map-set loan-repayments ((loan-id loan-id))
            ((total-paid new-total-paid)
             (last-payment-block block-height)
             (payment-count new-payment-count)
             (remaining-balance new-remaining)))
          
          ;; Check if loan is fully paid
          (if (<= new-remaining u0)
              (begin
                ;; Mark loan as completed
                (map-set loans ((loan-id loan-id))
                  ((requester (get requester loan-data))
                   (amount (get amount loan-data))
                   (purpose (get purpose loan-data))
                   (interest-rate (get interest-rate loan-data))
                   (total-amount (get total-amount loan-data))
                   (status LOAN_COMPLETED)
                   (approved-at (get approved-at loan-data))
                   (disbursed-at (get disbursed-at loan-data))
                   (due-date (get due-date loan-data))
                   (monthly-payment (get monthly-payment loan-data))))
                
                ;; Update credit score positively
                (update-member-credit (get requester loan-data) amount true)
                (ok true))
              (ok true)))
        ERR_LOAN_NOT_FOUND))
    ERR_LOAN_NOT_FOUND)

;; Update member credit information
(define-private (update-member-credit (member principal) (amount uint) (is-completion bool))
  (let ((current-credit (default-to 
          { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0,
            total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
          (map-get? member-credit ((member member))))))
    (if is-completion
        ;; Loan completed - improve credit score
        (map-set member-credit ((member member))
          ((credit-score (min (+ (get credit-score current-credit) u10) u850))
           (total-loans (get total-loans current-credit))
           (completed-loans (+ (get completed-loans current-credit) u1))
           (defaulted-loans (get defaulted-loans current-credit))
           (total-borrowed (get total-borrowed current-credit))
           (total-repaid (+ (get total-repaid current-credit) amount))
           (avg-payment-delay (get avg-payment-delay current-credit))))
        ;; New loan - update stats
        (map-set member-credit ((member member))
          ((credit-score (get credit-score current-credit))
           (total-loans (+ (get total-loans current-credit) u1))
           (completed-loans (get completed-loans current-credit))
           (defaulted-loans (get defaulted-loans current-credit))
           (total-borrowed (+ (get total-borrowed current-credit) amount))
           (total-repaid (get total-repaid current-credit))
           (avg-payment-delay (get avg-payment-delay current-credit)))))))

;; Check for defaulted loans
(define-public (mark-default (loan-id uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (match (map-get? loans ((loan-id loan-id)))
      loan-data
      (begin
        (asserts! (> block-height (+ (get due-date loan-data) (var-get default-threshold-blocks))) ERR_UNAUTHORIZED)
        
        ;; Mark loan as defaulted
        (map-set loans ((loan-id loan-id))
          ((requester (get requester loan-data))
           (amount (get amount loan-data))
           (purpose (get purpose loan-data))
           (interest-rate (get interest-rate loan-data))
           (total-amount (get total-amount loan-data))
           (status LOAN_DEFAULTED)
           (approved-at (get approved-at loan-data))
           (disbursed-at (get disbursed-at loan-data))
           (due-date (get due-date loan-data))
           (monthly-payment (get monthly-payment loan-data))))
        
        ;; Update credit score negatively
        (let ((current-credit (default-to 
                { credit-score: u650, total-loans: u0, completed-loans: u0, defaulted-loans: u0,
                  total-borrowed: u0, total-repaid: u0, avg-payment-delay: u0 }
                (map-get? member-credit ((member (get requester loan-data)))))))
          (map-set member-credit ((member (get requester loan-data)))
            ((credit-score (max (- (get credit-score current-credit) u50) u300))
             (total-loans (get total-loans current-credit))
             (completed-loans (get completed-loans current-credit))
             (defaulted-loans (+ (get defaulted-loans current-credit) u1))
             (total-borrowed (get total-borrowed current-credit))
             (total-repaid (get total-repaid current-credit))
             (avg-payment-delay (get avg-payment-delay current-credit)))))
        (ok true))
      ERR_LOAN_NOT_FOUND))

;; Read-only functions
(define-read-only (get-loan (id uint))
  (map-get? loans ((id id))))

(define-read-only (get-loan-repayments (loan-id uint))
  (map-get? loan-repayments ((loan-id loan-id))))

(define-read-only (get-member-credit (member principal))
  (map-get? member-credit ((member member))))

(define-read-only (get-credit-score (member principal))
  (match (map-get? member-credit ((member member)))
    credit-data (ok (get credit-score credit-data))
    (ok u650))) ;; Default credit score
