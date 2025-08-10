;; profit-sharing.clar
;; Enhanced profit distribution with automated calculation based on simpanan ratios
;; Replace contract constants with deployed principals.

(define-constant GOVERNOR_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace later
(define-constant MEMBERSHIP_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with membership contract
(define-constant TREASURY_CONTRACT 'SP000000000000000000002Q6VF78) ;; replace with treasury contract

;; Error constants
(define-constant ERR_UNAUTHORIZED (err u400))
(define-constant ERR_LENGTH_MISMATCH (err u401))
(define-constant ERR_TRANSFER_FAILED (err u402))
(define-constant ERR_NO_MEMBERS (err u403))
(define-constant ERR_INSUFFICIENT_FUNDS (err u404))

;; Distribution tracking
(define-map distribution-history
  ((distribution-id uint))
  ((total-amount uint)
   (total-members uint)
   (distribution-date uint)
   (distribution-type uint))) ;; 1=manual, 2=automatic

(define-map member-distributions
  ((distribution-id uint) (member principal))
  ((amount-received uint)
   (simpanan-at-time uint)
   (percentage uint)))

(define-data-var distribution-count uint u0)
(define-data-var min-distribution-amount uint u1000000) ;; minimum 1 STX to distribute

;; Manual distribution (existing functionality - for governance decisions)
(define-public (distribute (recipients (list 100 principal)) (amounts (list 100 uint)))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (let ((len-r (len recipients))
          (len-a (len amounts)))
      (asserts! (is-eq len-r len-a) ERR_LENGTH_MISMATCH)
      (let ((distribution-id (+ (var-get distribution-count) u1))
            (total-amount (fold + amounts u0)))
        (begin
          ;; Record distribution
          (map-set distribution-history ((distribution-id distribution-id))
            ((total-amount total-amount)
             (total-members len-r)
             (distribution-date block-height)
             (distribution-type u1))) ;; manual
          
          (var-set distribution-count distribution-id)
          (distribute-loop recipients amounts u0 distribution-id))))))

;; Automated distribution based on simpanan ratios
(define-public (auto-distribute (profit-amount uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    (asserts! (>= profit-amount (var-get min-distribution-amount)) ERR_INSUFFICIENT_FUNDS)
    
    ;; Get total simpanan to calculate ratios
    (match (contract-call? MEMBERSHIP_CONTRACT get-total-simpanan)
      total-simpanan
      (match (contract-call? MEMBERSHIP_CONTRACT get-all-members)
        members-list
        (let ((distribution-id (+ (var-get distribution-count) u1)))
          (begin
            ;; Record distribution
            (map-set distribution-history ((distribution-id distribution-id))
              ((total-amount profit-amount)
               (total-members (len members-list))
               (distribution-date block-height)
               (distribution-type u2))) ;; automatic
            
            (var-set distribution-count distribution-id)
            ;; Calculate and distribute based on simpanan ratios
            (auto-distribute-to-members members-list profit-amount total-simpanan distribution-id)))
        ERR_NO_MEMBERS)
      ERR_NO_MEMBERS)))

;; Calculate individual distribution amounts based on simpanan ratio
(define-private (auto-distribute-to-members 
  (members (list 100 principal)) 
  (total-profit uint) 
  (total-simpanan uint)
  (distribution-id uint))
  (fold auto-distribute-member members (ok { 
    total-profit: total-profit, 
    total-simpanan: total-simpanan, 
    distribution-id: distribution-id 
  })))

(define-private (auto-distribute-member 
  (member principal) 
  (state (response { total-profit: uint, total-simpanan: uint, distribution-id: uint } uint)))
  (match state
    state-data
    (match (contract-call? MEMBERSHIP_CONTRACT get-member member)
      member-data
      (let ((member-simpanan (get simpanan member-data))
            (total-profit (get total-profit state-data))
            (total-simpanan (get total-simpanan state-data))
            (distribution-id (get distribution-id state-data)))
        ;; Calculate member's share: (member_simpanan / total_simpanan) * total_profit
        (let ((member-share (/ (* member-simpanan total-profit) total-simpanan))
              (percentage (/ (* member-simpanan u10000) total-simpanan))) ;; percentage in basis points
          (if (> member-share u0)
              (begin
                ;; Record member distribution
                (map-set member-distributions 
                  ((distribution-id distribution-id) (member member))
                  ((amount-received member-share)
                   (simpanan-at-time member-simpanan)
                   (percentage percentage)))
                
                ;; Transfer STX to member
                (match (stx-transfer? member-share (as-contract tx-sender) member)
                  success (ok state-data)
                  error ERR_TRANSFER_FAILED))
              (ok state-data))))
      (ok state-data))
    error error))

;; Enhanced distribution loop with tracking
(define-private (distribute-loop 
  (recipients (list 100 principal)) 
  (amounts (list 100 uint)) 
  (idx uint)
  (distribution-id uint))
  (let ((len (len recipients)))
    (if (>= idx len)
        (ok true)
        (let ((recipient (unwrap-panic (element-at recipients idx)))
              (amt (unwrap-panic (element-at amounts idx))))
          (begin
            ;; Record individual distribution
            (map-set member-distributions 
              ((distribution-id distribution-id) (member recipient))
              ((amount-received amt)
               (simpanan-at-time u0) ;; manual distribution
               (percentage u0)))
            
            ;; Transfer STX
            (match (stx-transfer? amt (as-contract tx-sender) recipient)
              success (distribute-loop recipients amounts (+ idx u1) distribution-id)
              error ERR_TRANSFER_FAILED))))))

;; Quick profit distribution (for smaller amounts)
(define-public (distribute-equal (total-amount uint))
  (begin
    (asserts! (is-eq tx-sender GOVERNOR_CONTRACT) ERR_UNAUTHORIZED)
    
    (match (contract-call? MEMBERSHIP_CONTRACT get-all-members)
      members-list
      (let ((member-count (len members-list))
            (amount-per-member (/ total-amount member-count))
            (distribution-id (+ (var-get distribution-count) u1)))
        (begin
          ;; Record distribution
          (map-set distribution-history ((distribution-id distribution-id))
            ((total-amount total-amount)
             (total-members member-count)
             (distribution-date block-height)
             (distribution-type u3))) ;; equal distribution
          
          (var-set distribution-count distribution-id)
          (distribute-equal-to-members members-list amount-per-member distribution-id)))
      ERR_NO_MEMBERS)))

(define-private (distribute-equal-to-members 
  (members (list 100 principal)) 
  (amount-per-member uint)
  (distribution-id uint))
  (fold distribute-equal-member members (ok { 
    amount: amount-per-member, 
    distribution-id: distribution-id 
  })))

(define-private (distribute-equal-member 
  (member principal) 
  (state (response { amount: uint, distribution-id: uint } uint)))
  (match state
    state-data
    (let ((amount (get amount state-data))
          (distribution-id (get distribution-id state-data)))
      (begin
        ;; Record member distribution
        (map-set member-distributions 
          ((distribution-id distribution-id) (member member))
          ((amount-received amount)
           (simpanan-at-time u0)
           (percentage u0)))
        
        ;; Transfer STX
        (match (stx-transfer? amount (as-contract tx-sender) member)
          success (ok state-data)
          error ERR_TRANSFER_FAILED)))
    error error))

;; Read-only functions
(define-read-only (get-balance)
  (stx-get-balance (as-contract tx-sender)))

(define-read-only (get-distribution-history (distribution-id uint))
  (map-get? distribution-history ((distribution-id distribution-id))))

(define-read-only (get-member-distribution (distribution-id uint) (member principal))
  (map-get? member-distributions ((distribution-id distribution-id) (member member))))

(define-read-only (get-total-distributions)
  (var-get distribution-count))

;; Calculate potential distribution for a member based on current simpanan
(define-read-only (calculate-member-share (member principal) (total-profit uint))
  (match (contract-call? MEMBERSHIP_CONTRACT get-member member)
    member-data
    (match (contract-call? MEMBERSHIP_CONTRACT get-total-simpanan)
      total-simpanan
      (let ((member-simpanan (get simpanan member-data)))
        (ok (/ (* member-simpanan total-profit) total-simpanan)))
      (err u500))
    (err u501)))
