;; treasury.clar
;; Minimal treasury holding STX. Only governor can instruct sends.
;; Replace GOVERNOR_CONTRACT with the governor principal after deploying governor.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with governor contract principal

(define-data-var authorized-minter principal GOVERNOR_CONTRACT)

;; Anyone can deposit STX by calling the contract with an attached STX transfer in Clarinet.
;; To send STX out, only GOVERNOR_CONTRACT may call send-funds.

(define-public (send-funds (recipient principal) (amount uint))
  (begin
    (if (is-eq tx-sender (var-get authorized-minter))
        (begin
          (let ((res (stx-transfer? amount (as-contract tx-sender) recipient)))
            (match res
              ok (ok true)
              err (err u201))))
        (err u200)))) ;; unauthorized

(define-read-only (get-balance)
  (ok (contract-balance)))
