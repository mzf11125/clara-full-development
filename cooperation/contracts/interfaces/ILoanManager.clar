;; Enhanced Loan Manager Interface
;; Interface for the enhanced loan management system

(define-trait loan-manager-trait
  (
    ;; Core loan functions
    (request-loan (uint (buff 256) uint) (response uint uint))
    (approve-loan (uint) (response bool uint))
    (disburse-loan (uint) (response bool uint))
    (make-repayment (uint uint) (response bool uint))
    (mark-default (uint) (response bool uint))
    
    ;; Read-only functions
    (get-loan (uint) (response (optional {requester: principal, amount: uint, purpose: (buff 256), interest-rate: uint, total-amount: uint, status: uint, approved-at: uint, disbursed-at: uint, due-date: uint, monthly-payment: uint}) uint))
    (get-loan-repayments (uint) (response (optional {total-paid: uint, last-payment-block: uint, payment-count: uint, remaining-balance: uint}) uint))
    (get-member-credit (principal) (response (optional {credit-score: uint, total-loans: uint, completed-loans: uint, defaulted-loans: uint, total-borrowed: uint, total-repaid: uint, avg-payment-delay: uint}) uint))
    (get-credit-score (principal) (response uint uint))
  )
)
