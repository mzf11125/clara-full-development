"use client"

import { useState } from "react"
import Link from "next/link"
import { CreditCard, Users, Clock, DollarSign, TrendingUp, Shield, Plus, CheckCircle, XCircle } from "lucide-react"

const loanRequests = [
  {
    id: "LOAN-001",
    borrower: "RINA SARI",
    borrowerId: "DAO-M-045",
    amount: 5000000,
    purpose: "MODAL USAHA WARUNG",
    description: "Pinjaman untuk modal awal warung makan dengan menu khas daerah",
    duration: 12,
    interestRate: 12,
    collateral: "BPKB MOTOR",
    guarantors: ["DAO-M-023", "DAO-M-067"],
    approvalsNeeded: 20,
    currentApprovals: 12,
    rejections: 3,
    timeLeft: "4 DAYS",
    status: "VOTING",
    riskLevel: "MEDIUM",
    creditScore: 750,
  },
  {
    id: "LOAN-002",
    borrower: "JOKO WIDODO",
    borrowerId: "DAO-M-078",
    amount: 15000000,
    purpose: "EKSPANSI TOKO",
    description: "Pengembangan toko kelontong dengan sistem POS dan inventory digital",
    duration: 24,
    interestRate: 12,
    collateral: "SERTIFIKAT TANAH",
    guarantors: ["DAO-M-012", "DAO-M-034"],
    approvalsNeeded: 30,
    currentApprovals: 28,
    rejections: 1,
    timeLeft: "1 DAY",
    status: "ALMOST_APPROVED",
    riskLevel: "LOW",
    creditScore: 820,
  },
  {
    id: "LOAN-003",
    borrower: "DEWI KARTIKA",
    borrowerId: "DAO-M-089",
    amount: 3000000,
    purpose: "PENDIDIKAN ANAK",
    description: "Biaya sekolah dan kursus programming untuk anak",
    duration: 18,
    interestRate: 10,
    collateral: "TABUNGAN BERJANGKA",
    guarantors: ["DAO-M-056", "DAO-M-091"],
    approvalsNeeded: 15,
    currentApprovals: 8,
    rejections: 7,
    timeLeft: "6 DAYS",
    status: "CONTESTED",
    riskLevel: "HIGH",
    creditScore: 680,
  },
]

const userLoans = [
  {
    id: "LOAN-USER-001",
    amount: 8000000,
    purpose: "MODAL USAHA",
    monthlyPayment: 750000,
    remainingBalance: 6200000,
    nextPayment: "2024-02-01",
    status: "ACTIVE",
    paymentsLeft: 9,
  },
]

const loanStats = {
  totalLoansApproved: 45,
  totalAmountLent: 450000000,
  averageInterestRate: 11.5,
  defaultRate: 2.1,
  userVotingPower: 29,
  loansVotedOn: 23,
}

export default function LoanHub() {
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [voteChoice, setVoteChoice] = useState<string>("")
  const [viewMode, setViewMode] = useState("PENDING")

  const handleVote = (loanId: string, choice: string) => {
    alert(`Vote "${choice}" submitted for ${loanId} with 29 voting tokens!`)
    setSelectedLoan(null)
    setVoteChoice("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VOTING":
        return "bg-yellow-400 text-black"
      case "ALMOST_APPROVED":
        return "bg-green-400 text-black"
      case "CONTESTED":
        return "bg-red-500 text-white"
      case "APPROVED":
        return "bg-green-500 text-white"
      case "REJECTED":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-400 text-black"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "bg-green-400 text-black"
      case "MEDIUM":
        return "bg-yellow-400 text-black"
      case "HIGH":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-400 text-black"
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="neo-title text-black">
            LOAN
            <span className="block text-orange-400">HUB</span>
          </h1>
          <p className="neo-text mono">P2P LENDING WITH DEMOCRATIC APPROVAL</p>
        </div>

        {/* User Loan Status */}
        <div className="neo-card bg-gradient-to-r from-orange-400 to-orange-300 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black uppercase mb-4">YOUR ACTIVE LOAN</h2>
              {userLoans.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-sm">REMAINING BALANCE</p>
                      <p className="text-2xl font-black">RP {(userLoans[0].remainingBalance / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">MONTHLY PAYMENT</p>
                      <p className="text-2xl font-black">RP {(userLoans[0].monthlyPayment / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <div className="neo-progress">
                    <div
                      className="neo-progress-fill bg-green-400"
                      style={{
                        width: `${((userLoans[0].amount - userLoans[0].remainingBalance) / userLoans[0].amount) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="font-bold">NEXT PAYMENT: {userLoans[0].nextPayment}</p>
                </div>
              ) : (
                <p className="text-xl font-bold">NO ACTIVE LOANS</p>
              )}
            </div>

            <div className="text-center">
              <Link href="/loans/apply" className="neo-button-pink w-full mb-4">
                <Plus className="w-5 h-5 mr-2" />
                APPLY FOR LOAN
              </Link>
              <div className="text-center">
                <p className="font-bold text-sm">YOUR VOTING POWER</p>
                <p className="text-2xl font-black">{loanStats.userVotingPower} TOKENS</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="neo-card">
          <div className="flex flex-wrap gap-2">
            {["PENDING", "APPROVED", "MY VOTES", "LEADERBOARD"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 border-4 border-black font-bold text-sm shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150 ${
                  viewMode === mode ? "bg-orange-400 text-black" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Loan Requests */}
        {viewMode === "PENDING" && (
          <div className="space-y-6">
            <h2 className="neo-subtitle">PENDING LOAN APPROVALS</h2>

            {loanRequests.map((loan) => (
              <div
                key={loan.id}
                className="neo-card hover:shadow-[12px_12px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Loan Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black uppercase">{loan.borrower}</h3>
                        <p className="mono font-bold">{loan.borrowerId}</p>
                        <p className="font-bold text-lg text-blue-600">{loan.purpose}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`neo-badge ${getStatusColor(loan.status)}`}>
                          {loan.status.replace("_", " ")}
                        </span>
                        <span className={`neo-badge ${getRiskColor(loan.riskLevel)}`}>{loan.riskLevel} RISK</span>
                      </div>
                    </div>

                    <p className="neo-text text-gray-700 mb-4">{loan.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-yellow-100 border-4 border-black">
                        <DollarSign className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm font-bold">AMOUNT</p>
                        <p className="text-lg font-black">RP {(loan.amount / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="text-center p-3 bg-pink-100 border-4 border-black">
                        <Clock className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm font-bold">DURATION</p>
                        <p className="text-lg font-black">{loan.duration} MONTHS</p>
                      </div>
                      <div className="text-center p-3 bg-cyan-100 border-4 border-black">
                        <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm font-bold">INTEREST</p>
                        <p className="text-lg font-black">{loan.interestRate}%</p>
                      </div>
                      <div className="text-center p-3 bg-green-100 border-4 border-black">
                        <Shield className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm font-bold">CREDIT SCORE</p>
                        <p className="text-lg font-black">{loan.creditScore}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold">COLLATERAL:</span>
                        <span className="font-bold">{loan.collateral}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">GUARANTORS:</span>
                        <span className="font-bold">{loan.guarantors.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">TIME LEFT:</span>
                        <span className="font-bold text-red-600">{loan.timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="font-bold mb-2">APPROVAL PROGRESS</h4>
                      <div className="neo-progress mb-2">
                        <div
                          className="neo-progress-fill bg-green-400"
                          style={{ width: `${(loan.currentApprovals / loan.approvalsNeeded) * 100}%` }}
                        ></div>
                      </div>
                      <p className="font-bold">
                        {loan.currentApprovals}/{loan.approvalsNeeded} APPROVALS
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-green-100 border-4 border-black p-2">
                        <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                        <p className="font-black">{loan.currentApprovals}</p>
                        <p className="text-xs font-bold">APPROVED</p>
                      </div>
                      <div className="bg-red-100 border-4 border-black p-2">
                        <XCircle className="w-6 h-6 mx-auto mb-1 text-red-600" />
                        <p className="font-black">{loan.rejections}</p>
                        <p className="text-xs font-bold">REJECTED</p>
                      </div>
                    </div>

                    {selectedLoan === loan.id ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <button
                            onClick={() => setVoteChoice("APPROVE")}
                            className={`w-full p-3 border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000] ${
                              voteChoice === "APPROVE" ? "bg-green-400 text-black" : "bg-white text-black"
                            }`}
                          >
                            ✓ APPROVE LOAN
                          </button>
                          <button
                            onClick={() => setVoteChoice("REJECT")}
                            className={`w-full p-3 border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000] ${
                              voteChoice === "REJECT" ? "bg-red-500 text-white" : "bg-white text-black"
                            }`}
                          >
                            ✗ REJECT LOAN
                          </button>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVote(loan.id, voteChoice)}
                            disabled={!voteChoice}
                            className="neo-button-yellow flex-1 disabled:opacity-50"
                          >
                            SUBMIT VOTE
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLoan(null)
                              setVoteChoice("")
                            }}
                            className="neo-button bg-gray-400 text-black"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedLoan(loan.id)} className="neo-button-orange w-full">
                        <CreditCard className="w-5 h-5 mr-2" />
                        VOTE ON LOAN
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === "LEADERBOARD" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Borrowers */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">TOP BORROWERS</h3>

              <div className="space-y-3">
                {[
                  { name: "SITI NURHALIZA", id: "DAO-M-023", loans: 3, repayment: 100, score: 850 },
                  { name: "BUDI SANTOSO", id: "DAO-M-012", loans: 2, repayment: 98, score: 820 },
                  { name: "AHMAD WIJAYA", id: "DAO-M-001", loans: 1, repayment: 100, score: 780 },
                ].map((borrower, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-100 border-4 border-black">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center border-4 border-black font-black ${
                          index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-300" : "bg-orange-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-black">{borrower.name}</p>
                        <p className="mono text-sm">{borrower.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">{borrower.repayment}%</p>
                      <p className="text-sm font-bold">REPAYMENT RATE</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Statistics */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">LOAN STATISTICS</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-100 border-4 border-black">
                  <p className="text-2xl font-black">{loanStats.totalLoansApproved}</p>
                  <p className="font-bold text-sm">LOANS APPROVED</p>
                </div>
                <div className="text-center p-4 bg-pink-100 border-4 border-black">
                  <p className="text-2xl font-black">RP {(loanStats.totalAmountLent / 1000000000).toFixed(1)}B</p>
                  <p className="font-bold text-sm">TOTAL LENT</p>
                </div>
                <div className="text-center p-4 bg-cyan-100 border-4 border-black">
                  <p className="text-2xl font-black">{loanStats.averageInterestRate}%</p>
                  <p className="font-bold text-sm">AVG INTEREST</p>
                </div>
                <div className="text-center p-4 bg-green-100 border-4 border-black">
                  <p className="text-2xl font-black">{loanStats.defaultRate}%</p>
                  <p className="font-bold text-sm">DEFAULT RATE</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-100 border-4 border-black">
                <h4 className="font-black mb-2">YOUR PARTICIPATION</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-black">{loanStats.loansVotedOn}</p>
                    <p className="font-bold text-sm">LOANS VOTED</p>
                  </div>
                  <div>
                    <p className="text-xl font-black">{loanStats.userVotingPower}</p>
                    <p className="font-bold text-sm">VOTING POWER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neo-card bg-yellow-400 text-black text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{loanRequests.length}</p>
            <p className="font-bold text-sm">PENDING LOANS</p>
          </div>

          <div className="neo-card bg-pink-500 text-white text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{loanStats.totalLoansApproved}</p>
            <p className="font-bold text-sm">APPROVED</p>
          </div>

          <div className="neo-card bg-cyan-400 text-black text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{loanStats.averageInterestRate}%</p>
            <p className="font-bold text-sm">AVG RATE</p>
          </div>

          <div className="neo-card bg-green-400 text-black text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{(100 - loanStats.defaultRate).toFixed(1)}%</p>
            <p className="font-bold text-sm">SUCCESS RATE</p>
          </div>
        </div>

        {/* Smart Contract Notice */}
        <div className="neo-card bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-black uppercase">SMART CONTRACT SECURED</h3>
              <p className="font-bold">
                All loan disbursements and repayments are handled automatically by blockchain smart contracts
              </p>
              <p className="text-sm opacity-90">Transparent, immutable, and trustless P2P lending system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
