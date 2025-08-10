;; Enhanced Koperasi Governor Interface
;; Interface for weighted voting governance system

(define-trait koperasi-governor-trait
  (
    ;; Proposal management
    (create-proposal (uint (buff 256) uint principal) (response uint uint))
    (vote (uint bool) (response bool uint))
    (execute-proposal (uint) (response bool uint))
    (cancel-proposal (uint) (response bool uint))
    
    ;; Weighted voting functions
    (calculate-voting-power (principal) (response uint uint))
    (get-proposal-weighted-votes (uint) (response {for-votes: uint, against-votes: uint, total-weight: uint} uint))
    (check-weighted-quorum (uint) (response bool uint))
    
    ;; Governance settings
    (set-voting-period (uint) (response bool uint))
    (set-quorum-threshold (uint) (response bool uint))
    (set-execution-delay (uint) (response bool uint))
    (update-voting-weights () (response bool uint))
    
    ;; Read-only functions
    (get-proposal (uint) (response (optional {proposer: principal, action-type: uint, description: (buff 256), for-votes: uint, against-votes: uint, created-at: uint, voting-ends-at: uint, executed: bool, cancelled: bool, target-contract: principal, num-arg: uint, text-arg: (buff 256), total-voting-weight: uint, quorum-met: bool}) uint))
    (has-voted (uint principal) (response bool uint))
    (get-proposal-status (uint) (response uint uint))
    (get-voting-power (principal) (response uint uint))
    (get-active-proposals () (response (list 100 uint) uint))
    (get-governance-stats () (response {total-proposals: uint, active-proposals: uint, executed-proposals: uint, total-voters: uint, avg-participation: uint} uint))
  )
)