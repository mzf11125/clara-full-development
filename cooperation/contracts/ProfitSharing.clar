;; profit-sharing.clar
;; Governor-triggered distribution using off-chain prepared list.
;; Because Clarity can't iterate maps easily, the caller supplies recipients and amounts.
;; Replace GOVERNOR_CONTRACT with the governor principal.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace later

;; Distribute: takes two parallel lists: principals and amounts (uint)
(define-public (distribute (recipients (list 100 principal)) (amounts (list 100 uint)))
  (begin
    ;; only governor may call
    (if (is-eq tx-sender GOVERNOR_CONTRACT)
        (let ((len-r (len recipients))
              (len-a (len amounts)))
          (if (is-eq len-r len-a)
              (distribute-loop recipients amounts u0)
              (err u401))) ;; length mismatch
        (err u400))))

(define-public (distribute-loop (recipients (list 100 principal)) (amounts (list 100 uint)) (idx uint))
  (let ((len (len recipients)))
    (if (>= idx len)
        (ok true)
        (let ((recipient (unwrap-panic (list-get recipients idx)))
              (amt (unwrap-panic (list-get amounts idx))))
          (begin
            ;; send STX to recipient
            (let ((res (stx-transfer? amt (as-contract tx-sender) recipient)))
              (match res
                ok (distribute-loop recipients amounts (+ idx u1))
                err (err u402))))))))

;; read contract balance
(define-read-only (get-balance)
  (ok (contract-balance)))
