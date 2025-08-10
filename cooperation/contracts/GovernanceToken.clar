;; governance-token.clar
;; Minimal SIP-010-like fungible token used as voting power.
;; Token is soulbound: transfers are disabled. Only minter (MINTER_PRINCIPAL) can mint/burn.

(define-constant MINTER_PRINCIPAL 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR) ;; replace with deployer or membership contract principal

(define-map balances
    {owner: principal}
    {balance: uint})

(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender MINTER_PRINCIPAL) (err u100))
    (let ((cur (get-balance recipient)))
      (map-set balances {owner: recipient} {balance: (+ cur amount)})
      (ok true))))

(define-public (burn (holder principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender MINTER_PRINCIPAL) (err u100))
    (match (map-get? balances {owner: holder})
      entry
      (let ((cur (get balance entry)))
        (if (>= cur amount)
            (begin
              (map-set balances {owner: holder} {balance: (- cur amount)})
              (ok true))
            (err u102))) ;; insufficient
      (err u101))))

;; Transfers disabled to keep token soulbound
(define-public (transfer (recipient principal) (amount uint))
  (err u103)) ;; transfer-disabled

(define-read-only (get-balance (owner principal))
  (match (map-get? balances {owner: owner})
    entry (get balance entry)
    u0))