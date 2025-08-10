;; Individual Loan Interface
;; Interface for individual loan contract functionality

(define-trait loan-trait
  (
    ;; Loan lifecycle
    (initialize-loan (principal uint (buff 256) uint uint) (response bool uint))
    (disburse-funds () (response bool uint))
    (make-payment (uint) (response bool uint))
    (mark-completed () (response bool uint))
    (mark-defaulted () (response bool uint))
    
    ;; Loan calculations
    (calculate-monthly-payment () (response uint uint))
    (calculate-remaining-balance () (response uint uint))
    (calculate-interest-accrued () (response uint uint))
    (calculate-penalty () (response uint uint))
    
    ;; Read-only functions
    (get-loan-details () (response {borrower: principal, amount: uint, interest-rate: uint, total-amount: uint, monthly-payment: uint, start-date: uint, due-date: uint, status: uint} uint))
    (get-payment-history () (response (list 100 {amount: uint, payment-date: uint, principal: uint, interest: uint}) uint))
    (get-loan-status () (response uint uint))
    (is-overdue () (response bool uint))
    (days-overdue () (response uint uint))
  )
)
