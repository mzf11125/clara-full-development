;; Basic Membership Token Interface
;; Interface for core membership functionality

(define-trait membership-token-trait
  (
    ;; Core membership functions
    (mint-membership (principal uint) (response bool uint))
    (update-simpanan (principal uint) (response bool uint))
    (add-simpanan (principal uint) (response bool uint))
    (deduct-simpanan (principal uint) (response bool uint))
    
    ;; Read-only functions
    (get-member (principal) (response (optional {simpanan: uint, joined-at: uint, last-activity: uint, activity-score: uint, governance-participation: uint, loan-applications: uint, profit-distributions-received: uint, total-contributions: uint, member-tier: uint}) uint))
    (get-simpanan (principal) (response uint uint))
    (is-member (principal) (response bool uint))
    (get-membership-count () (response uint uint))
    (get-total-simpanan () (response uint uint))
    (get-all-members () (response (list 100 principal) uint))
  )
)