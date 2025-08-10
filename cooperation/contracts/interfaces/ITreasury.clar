;; Treasury Interface
;; Interface for treasury and fund management

(define-trait treasury-trait
  (
    ;; Fund management
    (deposit-funds (uint) (response bool uint))
    (withdraw-funds (uint principal (buff 256)) (response bool uint))
    (transfer-funds (principal uint (buff 256)) (response bool uint))
    (approve-payment (uint) (response bool uint))
    
    ;; Reserve management
    (set-reserve-ratio (uint) (response bool uint))
    (check-reserve-requirement () (response bool uint))
    (calculate-available-funds () (response uint uint))
    
    ;; Emergency functions
    (emergency-withdraw (principal uint) (response bool uint))
    (freeze-treasury () (response bool uint))
    (unfreeze-treasury () (response bool uint))
    
    ;; Read-only functions
    (get-balance () (response uint uint))
    (get-reserve-ratio () (response uint uint))
    (get-total-deposits () (response uint uint))
    (get-total-withdrawals () (response uint uint))
    (is-treasury-frozen () (response bool uint))
    (get-pending-payments () (response (list 100 uint) uint))
  )
)