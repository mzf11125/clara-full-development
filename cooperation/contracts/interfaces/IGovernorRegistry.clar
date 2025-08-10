;; Governor Registry Interface
;; Interface for contract registry and system management

(define-trait governor-registry-trait
  (
    ;; Registry management
    (register-contract ((string-ascii 50) principal) (response bool uint))
    (update-contract ((string-ascii 50) principal) (response bool uint))
    (deactivate-contract ((string-ascii 50)) (response bool uint))
    
    ;; Emergency functions
    (set-emergency-admin (principal) (response bool uint))
    (emergency-pause () (response bool uint))
    (emergency-resume () (response bool uint))
    
    ;; Read-only functions
    (get-contract-address ((string-ascii 50)) (response (optional {contract-address: principal, is-active: bool, deployed-at: uint, version: uint}) uint))
    (get-active-contract ((string-ascii 50)) (response (optional principal) uint))
    (is-system-active () (response bool uint))
    (get-owner () (response principal uint))
  )
)
