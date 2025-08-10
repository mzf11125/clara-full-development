;; membership-token.clar
;; Enhanced membership registry with member analytics and activity tracking
;; Replace ADMIN_PRINCIPAL with your deployer/admin principal.

(define-constant ADMIN_PRINCIPAL 'ST2TG9G3H0WD4Q69CXZ5KW973RFX5XGHD54TGX5PR) ;; replace with real admin
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_MEMBER_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_MEMBER (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

(define-data-var membership-count uint u0)
(define-data-var total-simpanan uint u0)
(define-data-var time-counter uint u0) ;; sequential counter instead of block-height

;; Helper function to get next sequential time
(define-private (get-next-time)
  (let ((next (+ (var-get time-counter) u1)))
    (var-set time-counter next)
    next))

;; Enhanced member data structure
(define-map members
  principal
  {simpanan: uint,
   joined-at: uint,
   last-activity: uint,
   activity-score: uint, ;; 0-1000 scale
   governance-participation: uint, ;; number of votes cast
   loan-applications: uint, ;; total loan applications
   profit-distributions-received: uint, ;; count of distributions received
   total-contributions: uint, ;; lifetime simpanan contributions
   member-tier: uint}) ;; 1=bronze, 2=silver, 3=gold, 4=platinum

;; Member activity tracking
(define-map member-activities
  {member: principal, activity-type: uint, time-id: uint}
  {details: (string-utf8 256),
   value: uint})

;; Activity types
(define-constant ACTIVITY_JOIN u1)
(define-constant ACTIVITY_VOTE u2)
(define-constant ACTIVITY_PROPOSE u3)
(define-constant ACTIVITY_LOAN_REQUEST u4)
(define-constant ACTIVITY_LOAN_REPAYMENT u5)
(define-constant ACTIVITY_SIMPANAN_INCREASE u6)
(define-constant ACTIVITY_PROFIT_RECEIVED u7)

;; Member statistics aggregation
(define-map member-stats
  principal
  {total-votes: uint,
   total-proposals: uint,
   total-loans-taken: uint,
   total-loans-repaid: uint,
   total-profit-received: uint,
   avg-monthly-activity: uint,
   reputation-score: uint}) ;; 0-100 scale

;; Enhanced membership minting with analytics initialization
(define-public (mint-membership (member principal) (simpanan uint))
  (begin
    (asserts! (is-eq tx-sender ADMIN_PRINCIPAL) ERR_UNAUTHORIZED)
    (asserts! (> simpanan u0) ERR_INVALID_AMOUNT)
    (asserts! (is-none (map-get? members member)) ERR_ALREADY_MEMBER)
    
    (let ((current-time (get-next-time))
          (initial-tier (calculate-member-tier simpanan)))
      (begin
        ;; Create member record
        (map-set members member 
          {simpanan: simpanan,
           joined-at: current-time,
           last-activity: current-time,
           activity-score: u100, ;; starting score
           governance-participation: u0,
           loan-applications: u0,
           profit-distributions-received: u0,
           total-contributions: simpanan,
           member-tier: initial-tier})
        
        ;; Initialize member statistics
        (map-set member-stats member
          {total-votes: u0,
           total-proposals: u0,
           total-loans-taken: u0,
           total-loans-repaid: u0,
           total-profit-received: u0,
           avg-monthly-activity: u0,
           reputation-score: u50}) ;; starting reputation
        
        ;; Record joining activity
        (try! (record-activity member ACTIVITY_JOIN u"Member joined koperasi" simpanan))
        
        ;; Update global counters
        (var-set membership-count (+ (var-get membership-count) u1))
        (var-set total-simpanan (+ (var-get total-simpanan) simpanan))
        (ok true)))))

;; Enhanced simpanan update with activity tracking
(define-public (update-simpanan (member principal) (new-simpanan uint))
  (begin
    (asserts! (is-eq tx-sender ADMIN_PRINCIPAL) ERR_UNAUTHORIZED)
    (asserts! (> new-simpanan u0) ERR_INVALID_AMOUNT)
    
    (match (map-get? members member)
      member-data
      (let ((old-simpanan (get simpanan member-data))
            (increase (- new-simpanan old-simpanan))
            (new-tier (calculate-member-tier new-simpanan)))
        (begin
          ;; Update member data
          (map-set members member 
            {simpanan: new-simpanan,
             joined-at: (get joined-at member-data),
             last-activity: (get-next-time),
             activity-score: (let ((new-score (+ (get activity-score member-data) u10)))
                            (if (> new-score u1000) u1000 new-score)),
             governance-participation: (get governance-participation member-data),
             loan-applications: (get loan-applications member-data),
             profit-distributions-received: (get profit-distributions-received member-data),
             total-contributions: (+ (get total-contributions member-data) increase),
             member-tier: new-tier})
          
          ;; Record activity if it's an increase
          (if (> new-simpanan old-simpanan)
              (try! (record-activity member ACTIVITY_SIMPANAN_INCREASE u"Increased simpanan" increase))
              true)
          
          ;; Update global total
          (var-set total-simpanan (+ (- (var-get total-simpanan) old-simpanan) new-simpanan))
          (ok true)))
      ERR_MEMBER_NOT_FOUND)))

;; Record member activity
(define-public (record-activity (member principal) (activity-type uint) (details (string-utf8 256)) (value uint))
  (begin
    ;; Can be called by admin or governance contracts
    (asserts! (or (is-eq tx-sender ADMIN_PRINCIPAL) 
                  (is-eq tx-sender (as-contract tx-sender))) ERR_UNAUTHORIZED)
    
    ;; Record the activity
    (map-set member-activities 
      {member: member, activity-type: activity-type, time-id: (get-next-time)}
      {details: details, value: value})
    
    ;; Update member's last activity and activity score
    (match (map-get? members member)
      member-data
      (begin
        (map-set members member
          {simpanan: (get simpanan member-data),
           joined-at: (get joined-at member-data),
           last-activity: (get-next-time),
           activity-score: (let ((new-score (+ (get activity-score member-data) u5)))
                            (if (> new-score u1000) u1000 new-score)),
           governance-participation: (if (or (is-eq activity-type ACTIVITY_VOTE) 
                                           (is-eq activity-type ACTIVITY_PROPOSE))
                                       (+ (get governance-participation member-data) u1)
                                       (get governance-participation member-data)),
           loan-applications: (if (is-eq activity-type ACTIVITY_LOAN_REQUEST)
                               (+ (get loan-applications member-data) u1)
                               (get loan-applications member-data)),
           profit-distributions-received: (if (is-eq activity-type ACTIVITY_PROFIT_RECEIVED)
                                           (+ (get profit-distributions-received member-data) u1)
                                           (get profit-distributions-received member-data)),
           total-contributions: (get total-contributions member-data),
           member-tier: (get member-tier member-data)})
        (ok true))
      ERR_MEMBER_NOT_FOUND)))

;; Calculate member tier based on simpanan
(define-private (calculate-member-tier (simpanan uint))
  (if (>= simpanan u10000000) ;; 10 STX
      u4 ;; Platinum
      (if (>= simpanan u5000000) ;; 5 STX
          u3 ;; Gold
          (if (>= simpanan u1000000) ;; 1 STX
              u2 ;; Silver
              u1)))) ;; Bronze

;; Update member statistics (called by other contracts)
(define-public (update-member-stats (member principal) (stat-type uint) (value uint))
  (begin
    (asserts! (or (is-eq tx-sender ADMIN_PRINCIPAL) 
                  (is-eq tx-sender (as-contract tx-sender))) ERR_UNAUTHORIZED)
    
    (match (map-get? member-stats member)
      current-stats
      (let ((new-stats
              (if (is-eq stat-type u1) ;; votes
                  (merge current-stats {total-votes: (+ (get total-votes current-stats) value)})
                  (if (is-eq stat-type u2) ;; proposals
                      (merge current-stats {total-proposals: (+ (get total-proposals current-stats) value)})
                      (if (is-eq stat-type u3) ;; loans taken
                          (merge current-stats {total-loans-taken: (+ (get total-loans-taken current-stats) value)})
                          (if (is-eq stat-type u4) ;; loans repaid
                              (merge current-stats {total-loans-repaid: (+ (get total-loans-repaid current-stats) value)})
                              (if (is-eq stat-type u5) ;; profit received
                                  (merge current-stats {total-profit-received: (+ (get total-profit-received current-stats) value)})
                                  current-stats)))))))
        (begin
          (map-set member-stats member new-stats)
          (update-reputation-score member)
          (ok true)))
      ERR_MEMBER_NOT_FOUND)))

;; Calculate and update reputation score
(define-private (update-reputation-score (member principal))
  (match (map-get? member-stats member)
    stats
    (match (map-get? members member)
      member-data
      (let ((governance-weight (let ((weight (* (get total-votes stats) u5)))
                             (if (> weight u30) u30 weight)))
            (loan-performance (if (> (get total-loans-taken stats) u0)
                               (let ((perf (/ (* (get total-loans-repaid stats) u40) (get total-loans-taken stats))))
                                 (if (> perf u40) u40 perf))
                               u0))
            (activity-weight (let ((weight (/ (get activity-score member-data) u20)))
                              (if (> weight u30) u30 weight)))
            (new-reputation (+ governance-weight (+ loan-performance activity-weight))))
        (map-set member-stats member
          (merge stats {reputation-score: new-reputation})))
      false)
    false))

;; Read-only functions
(define-read-only (get-member (member principal))
  (map-get? members member))

(define-read-only (get-simpanan (member principal))
  (match (map-get? members member)
    entry (ok (get simpanan entry))
    ERR_MEMBER_NOT_FOUND))

(define-read-only (is-member (member principal))
  (is-some (map-get? members member)))

(define-read-only (get-membership-count)
  (var-get membership-count))

(define-read-only (get-total-simpanan)
  (var-get total-simpanan))

(define-read-only (get-member-stats (member principal))
  (map-get? member-stats member))

(define-read-only (get-member-activity (member principal) (activity-type uint) (time-id uint))
  (map-get? member-activities {member: member, activity-type: activity-type, time-id: time-id}))

(define-read-only (get-member-tier-name (tier uint))
  (if (is-eq tier u4)
      u"Platinum"
      (if (is-eq tier u3)
          u"Gold"
          (if (is-eq tier u2)
              u"Silver"
              u"Bronze"))))

;; Get all members (for profit distribution - returns up to 100 members)
(define-read-only (get-all-members)
  ;; This is a simplified version - in practice, you'd need pagination
  ;; For now, returns a list of known active members
  (ok (list)))

;; Member analytics dashboard data
(define-read-only (get-member-dashboard (member principal))
  (match (map-get? members member)
    member-data
    (match (map-get? member-stats member)
      stats-data
      (ok {
        member-info: member-data,
        statistics: stats-data,
        tier-name: (get-member-tier-name (get member-tier member-data)),
        participation-rate: (if (> (get governance-participation member-data) u0)
                             (/ (* (get total-votes stats-data) u100) (get governance-participation member-data))
                             u0)
      })
      ERR_MEMBER_NOT_FOUND)
    ERR_MEMBER_NOT_FOUND))