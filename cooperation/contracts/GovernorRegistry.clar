;; Governor Registry Contract
;; Manages addresses of all cooperation contracts and provides centralized configuration

;; Set a fixed owner (replace with your principal)
;; (define-constant CONTRACT_OWNER 'ST1234567890ABCDEFGHIJKLMN1234567890ABCD)

;; Error constants
(define-constant ERR_UNAUTHORIZED (err u401))
(define-constant ERR_CONTRACT_NOT_FOUND (err u404))
(define-constant ERR_ALREADY_REGISTERED (err u405))

;; Contract registry
(define-map contract-registry
  ((contract-name (string-ascii 50)))
  ((contract-address principal)
   (is-active bool)
   (deployed-at uint)
   (version uint)))

;; System configuration
(define-data-var system-active bool true)
(define-data-var emergency-admin (optional principal) none)

;; Register a contract address
(define-public (register-contract (name (string-ascii 50)) (address principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (asserts! (is-none (map-get? contract-registry ((contract-name name)))) ERR_ALREADY_REGISTERED)
    (map-set contract-registry
      ((contract-name name))
      ((contract-address address)
       (is-active true)
       (deployed-at block-height)
       (version u1)))
    (ok true)
  )
)

;; Update contract address (for upgrades)
(define-public (update-contract (name (string-ascii 50)) (address principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (match (map-get? contract-registry ((contract-name name)))
      existing
      (begin
        (map-set contract-registry
          ((contract-name name))
          ((contract-address address)
           (is-active true)
           (deployed-at block-height)
           (version (+ (get version existing) u1))))
        (ok true))
      ERR_CONTRACT_NOT_FOUND)
  )
)

;; Get contract address
(define-read-only (get-contract-address (name (string-ascii 50)))
  (map-get? contract-registry ((contract-name name))))

;; Get active contract address only
(define-read-only (get-active-contract (name (string-ascii 50)))
  (match (map-get? contract-registry ((contract-name name)))
    contract-info
    (if (get is-active contract-info)
        (some (get contract-address contract-info))
        none)
    none)
)

;; Deactivate contract
(define-public (deactivate-contract (name (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (match (map-get? contract-registry ((contract-name name)))
      existing
      (begin
        (map-set contract-registry
          ((contract-name name))
          ((contract-address (get contract-address existing))
           (is-active false)
           (deployed-at (get deployed-at existing))
           (version (get version existing))))
        (ok true))
      ERR_CONTRACT_NOT_FOUND)
  )
)

;; Emergency functions
(define-public (set-emergency-admin (admin principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set emergency-admin (some admin))
    (ok true))
)

(define-public (emergency-pause)
  (begin
    (asserts! (or (is-eq tx-sender CONTRACT_OWNER) 
                  (is-eq (some tx-sender) (var-get emergency-admin))) ERR_UNAUTHORIZED)
    (var-set system-active false)
    (ok true))
)

(define-public (emergency-resume)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set system-active true)
    (ok true))
)

;; Read-only functions
(define-read-only (is-system-active)
  (var-get system-active))

(define-read-only (get-owner)
  CONTRACT_OWNER)
