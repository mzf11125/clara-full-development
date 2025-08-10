;; Enhanced Governance Token Interface
;; Interface for weighted voting governance token

(define-trait governance-token-trait
  (
    ;; Core token functions
    (mint (principal uint) (response bool uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    
    ;; Weighted voting functions
    (get-voting-power (principal) (response uint uint))
    (calculate-weighted-power (principal) (response uint uint))
    (update-voting-weights () (response bool uint))
    
    ;; Governance participation tracking
    (record-vote (principal uint) (response bool uint))
    (record-proposal (principal) (response bool uint))
    (get-governance-participation (principal) (response uint uint))
    
    ;; Read-only functions
    (is-authorized-minter (principal) (response bool uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
    (get-decimals () (response uint uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 10) uint))
  )
)
