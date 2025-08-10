;; loan-manager.clar
;; Simple loan request registry. Loans are approved by governor execution through treasury.
;; Replace GOVERNOR_CONTRACT constant after deployment.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with governor

(define-map loans
  ((id uint))
  ((requester principal)
   (amount uint)
   (purpose (buff 256))
   (approved bool)
   (executed bool)))

(define-data-var loan-count uint u0)

(define-public (request-loan (amount uint) (purpose (buff 256)))
  (let ((id (+ (var-get loan-count) u1)))
    (begin
      (map-set loans ((id id)) ((requester tx-sender) (amount amount) (purpose purpose) (approved false) (executed false)))
      (var-set loan-count id)
      (ok id))))

;; Governor marks loan approved; governor later calls treasury to execute.
(define-public (approve-loan (id uint))
  (begin
    (if (is-eq tx-sender GOVERNOR_CONTRACT)
        (match (map-get loans ((id id)))
          entry
          (begin
            (map-set loans ((id id)) ((requester (get requester entry)) (amount (get amount entry)) (purpose (get purpose entry)) (approved true) (executed (get executed entry))))
            (ok true))
          (err u301))
        (err u300))))

(define-public (mark-executed (id uint))
  (begin
    ;; only governor may mark executed after treasury sent
    (if (is-eq tx-sender GOVERNOR_CONTRACT)
        (match (map-get loans ((id id)))
          entry
          (begin
            (map-set loans ((id id)) ((requester (get requester entry)) (amount (get amount entry)) (purpose (get purpose entry)) (approved (get approved entry)) (executed true)))
            (ok true))
          (err u301))
        (err u300))))

(define-read-only (get-loan (id uint))
  (match (map-get loans ((id id)))
    entry (ok entry)
    (err u301)))
