;; governance-token.clar
;; Minimal SIP-010-like fungible token used as voting power.
;; Token is soulbound: transfers are disabled. Only minter (MINTER_PRINCIPAL) can mint/burn.

(define-constant MINTER_PRINCIPAL 'SP000000000000000000002Q6VF78) ;; replace with deployer or membership contract principal

(define-map balances
  ((owner principal))
  ((balance uint)))

(define-public (mint (recipient principal) (amount uint))
  (begin
    (if (is-eq tx-sender MINTER_PRINCIPAL)
        (let ((cur (default-to u0 (match (map-get balances ((owner recipient))) entry (ok (get balance entry)) (ok u0)))))
          (map-set balances ((owner recipient)) ((balance (+ cur amount))))
          (ok true))
        (err u100))))

(define-public (burn (holder principal) (amount uint))
  (begin
    (if (is-eq tx-sender MINTER_PRINCIPAL)
        (match (map-get balances ((owner holder)))
          entry
          (let ((cur (get balance entry)))
            (if (>= cur amount)
                (begin
                  (map-set balances ((owner holder)) ((balance (- cur amount))))
                  (ok true))
                (err u102))) ;; insufficient
          (err u101))
        (err u100))))

;; Transfers disabled to keep token soulbound
(define-public (transfer (recipient principal) (amount uint))
  (err u103)) ;; transfer-disabled

(define-read-only (get-balance (owner principal))
  (match (map-get balances ((owner owner)))
    entry (ok (get balance entry))
    (ok u0)))
