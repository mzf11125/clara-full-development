;; Enhanced Membership Token Interface
;; Interface for the enhanced membership system with analytics

(define-trait enhanced-membership-trait
  (
    ;; Core membership functions
    (mint-membership (principal uint) (response bool uint))
    (update-simpanan (principal uint) (response bool uint))
    (record-activity (principal uint (buff 256) uint) (response bool uint))
    (update-member-stats (principal uint uint) (response bool uint))
    
    ;; Read-only functions
    (get-member (principal) (response (optional {simpanan: uint, joined-at: uint, last-activity: uint, activity-score: uint, governance-participation: uint, loan-applications: uint, profit-distributions-received: uint, total-contributions: uint, member-tier: uint}) uint))
    (get-simpanan (principal) (response uint uint))
    (is-member (principal) (response bool uint))
    (get-membership-count () (response uint uint))
    (get-total-simpanan () (response uint uint))
    (get-member-stats (principal) (response (optional {total-votes: uint, total-proposals: uint, total-loans-taken: uint, total-loans-repaid: uint, total-profit-received: uint, avg-monthly-activity: uint, reputation-score: uint}) uint))
    (get-member-tier-name (uint) (response (string-ascii 10) uint))
    (get-all-members () (response (list 100 principal) uint))
    (get-member-dashboard (principal) (response {member-info: {simpanan: uint, joined-at: uint, last-activity: uint, activity-score: uint, governance-participation: uint, loan-applications: uint, profit-distributions-received: uint, total-contributions: uint, member-tier: uint}, statistics: {total-votes: uint, total-proposals: uint, total-loans-taken: uint, total-loans-repaid: uint, total-profit-received: uint, avg-monthly-activity: uint, reputation-score: uint}, tier-name: (string-ascii 10), participation-rate: uint} uint))
  )
)
