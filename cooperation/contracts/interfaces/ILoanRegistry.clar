;; Loan Registry Interface
;; Interface for managing loan contracts registry

(define-trait loan-registry-trait
  (
    ;; Registry management
    (register-loan (uint principal principal) (response bool uint))
    (update-loan-status (uint uint) (response bool uint))
    (archive-loan (uint) (response bool uint))
    
    ;; Loan queries
    (get-loan-contract (uint) (response (optional principal) uint))
    (get-member-loans (principal) (response (list 50 uint) uint))
    (get-active-loans () (response (list 100 uint) uint))
    (get-overdue-loans () (response (list 100 uint) uint))
    
    ;; Statistics
    (get-total-loans () (response uint uint))
    (get-active-loan-count () (response uint uint))
    (get-total-loan-amount () (response uint uint))
    (get-default-rate () (response uint uint))
    
    ;; Read-only functions
    (is-valid-loan (uint) (response bool uint))
    (get-loan-summary (uint) (response (optional {loan-id: uint, borrower: principal, amount: uint, status: uint, created-at: uint}) uint))
  )
)
