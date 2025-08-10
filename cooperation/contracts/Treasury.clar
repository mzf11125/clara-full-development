;; treasury.clar
;; Minimal treasury holding STX. Only governor can instruct sends.

(define-constant GOVERNOR_CONTRACT 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR.KoperasiGovernor) ;; replace after deploying governor

(define-data-var authorized-minter principal GOVERNOR_CONTRACT)

;; Send STX out only governor can call
(define-public (send-funds (recipient principal) (amount uint))
  (begin
    (if (is-eq tx-sender (var-get authorized-minter))
        (let ((res (stx-transfer? amount (as-contract tx-sender) recipient)))
          (match res
            ok (ok true)
            err (err u201)))
        (err u200)))) ;; unauthorized

;; Get this contract's STX balance
(define-read-only (get-balance)
  (ok (stx-get-balance (as-contract tx-sender))))
