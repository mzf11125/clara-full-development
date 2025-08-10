;; membership-token.clar
;; Minimal membership registry (SIP-009 style minimal)
;; Replace ADMIN_PRINCIPAL with your deployer/admin principal if desired.

(define-constant ADMIN_PRINCIPAL 'SP000000000000000000002Q6VF78) ;; replace with real admin
(define-data-var membership-count uint u0)

;; Map: key = principal, value = { simp: uint, joined: uint }
(define-map members
  ((member principal))
  ((simpanan uint)
   (joined-at uint)))

;; Initialize function optional (set admin by constant)
(define-public (mint-membership (member principal) (simpanan uint))
  (begin
    ;; only ADMIN_PRINCIPAL may mint membership (or some registry)
    (if (is-eq tx-sender ADMIN_PRINCIPAL)
        (begin
          (map-set members ((member member)) ((simpanan simpanan) (joined-at (unwrap-panic (get-block-info? block-height)))))
          (var-set membership-count (+ (var-get membership-count) u1))
          (ok true))
        (err u100)))) ;; unauthorized

(define-public (update-simpanan (member principal) (new-simpanan uint))
  (begin
    (if (is-eq tx-sender ADMIN_PRINCIPAL)
        (match (map-get members ((member member)))
          entry
          (begin
            (map-set members ((member member)) ((simpanan new-simpanan) (joined-at (get joined-at entry))))
            (ok true))
          (err u101)) ;; member-not-found
        (err u100))) ;; unauthorized
)

(define-read-only (get-simpanan (member principal))
  (match (map-get members ((member member)))
    entry (ok (get simpanan entry))
    (err u101)))

(define-read-only (is-member (member principal))
  (ok (is-some (map-get members ((member member)))))

)

(define-read-only (get-membership-count)
  (ok (var-get membership-count)))
