"use client"

import { useState } from "react"
import { Vote, Clock, Users, Zap, Trophy, Target, TrendingUp, AlertCircle } from "lucide-react"

const activeVotes = [
  {
    id: "VOTE-001",
    title: "DIGITAL WARUNG NETWORK",
    description: "Proposal to build smart digital warungs with IoT inventory management",
    type: "BUSINESS_INITIATIVE",
    totalVotes: 156,
    yesVotes: 98,
    noVotes: 58,
    abstainVotes: 0,
    quorumRequired: 120,
    timeLeft: "2 DAYS 14 HOURS",
    userVotingPower: 29,
    hasVoted: false,
    priority: "HIGH",
  },
  {
    id: "VOTE-002",
    title: "MERGER WITH KOPERASI SEJAHTERA",
    description: "Strategic merger proposal to expand market reach and resources",
    type: "MERGER_ACQUISITION",
    totalVotes: 89,
    yesVotes: 45,
    noVotes: 32,
    abstainVotes: 12,
    quorumRequired: 180,
    timeLeft: "5 DAYS 8 HOURS",
    userVotingPower: 29,
    hasVoted: true,
    userVote: "YES",
    priority: "CRITICAL",
  },
  {
    id: "VOTE-003",
    title: "QUARTERLY SHU DISTRIBUTION",
    description: "Approve Q4 2024 profit sharing distribution algorithm",
    type: "FINANCIAL",
    totalVotes: 203,
    yesVotes: 187,
    noVotes: 16,
    abstainVotes: 0,
    quorumRequired: 150,
    timeLeft: "12 HOURS",
    userVotingPower: 29,
    hasVoted: false,
    priority: "MEDIUM",
  },
]

const votingStats = {
  participationStreak: 12,
  totalVotesCast: 47,
  votingPowerUsed: 1363,
  accuracyRate: 89,
}

const badges = [
  { name: "DEMOCRACY CHAMPION", description: "Voted in 10+ consecutive proposals", earned: true },
  { name: "EARLY VOTER", description: "First 10 voters in 5+ proposals", earned: true },
  { name: "CONSENSUS BUILDER", description: "Voted with majority 80%+ of time", earned: true },
  { name: "CRITICAL THINKER", description: "Changed vote after discussion", earned: false },
]

export default function VotingArena() {
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const [voteChoice, setVoteChoice] = useState<string>("")

  const handleVote = (voteId: string, choice: string) => {
    // Simulate voting
    alert(`Vote "${choice}" submitted for ${voteId} with 29 voting tokens!`)
    setSelectedVote(null)
    setVoteChoice("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-500 text-white"
      case "HIGH":
        return "bg-orange-400 text-black"
      case "MEDIUM":
        return "bg-yellow-400 text-black"
      default:
        return "bg-gray-400 text-black"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BUSINESS_INITIATIVE":
        return "bg-green-400 text-black"
      case "MERGER_ACQUISITION":
        return "bg-red-500 text-white"
      case "FINANCIAL":
        return "bg-blue-500 text-white"
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
            VOTING
            <span className="block text-cyan-400">ARENA</span>
          </h1>
          <p className="neo-text mono">WEIGHTED DEMOCRATIC GOVERNANCE SYSTEM</p>
        </div>

        {/* Voting Power Card */}
        <div className="neo-card bg-gradient-to-r from-cyan-400 to-cyan-300 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black uppercase mb-2">YOUR VOTING POWER</h2>
              <div className="flex items-center space-x-4">
                <Zap className="w-12 h-12" />
                <div>
                  <p className="text-4xl font-black">29 TOKENS</p>
                  <p className="font-bold">BASED ON RP 2.9M SAVINGS</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black">{votingStats.participationStreak}</p>
                <p className="font-bold text-sm">STREAK</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">{votingStats.totalVotesCast}</p>
                <p className="font-bold text-sm">TOTAL VOTES</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-black">{votingStats.accuracyRate}%</p>
              <p className="font-bold text-sm">ACCURACY RATE</p>
              <p className="text-xs opacity-80">VOTES WITH MAJORITY</p>
            </div>
          </div>
        </div>

        {/* Active Votes */}
        <div className="space-y-6">
          <h2 className="neo-subtitle">ACTIVE VOTES</h2>

          {activeVotes.map((vote) => (
            <div
              key={vote.id}
              className="neo-card hover:shadow-[12px_12px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Vote Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black uppercase mb-2">{vote.title}</h3>
                      <p className="neo-text text-gray-700 mb-3">{vote.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`neo-badge ${getPriorityColor(vote.priority)}`}>{vote.priority}</span>
                        <span className={`neo-badge ${getTypeColor(vote.type)}`}>{vote.type.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold mono">{vote.timeLeft}</span>
                      </div>
                      <p className="text-sm font-bold">ID: {vote.id}</p>
                    </div>
                  </div>

                  {/* Vote Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">PARTICIPATION</span>
                      <span className="font-bold">
                        {vote.totalVotes}/{vote.quorumRequired} REQUIRED
                      </span>
                    </div>

                    <div className="neo-progress">
                      <div
                        className="neo-progress-fill bg-cyan-400"
                        style={{ width: `${Math.min((vote.totalVotes / vote.quorumRequired) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-green-400 border-4 border-black p-3">
                        <p className="text-2xl font-black">{vote.yesVotes}</p>
                        <p className="font-bold text-sm">YES VOTES</p>
                      </div>
                      <div className="bg-red-500 text-white border-4 border-black p-3">
                        <p className="text-2xl font-black">{vote.noVotes}</p>
                        <p className="font-bold text-sm">NO VOTES</p>
                      </div>
                      <div className="bg-gray-400 border-4 border-black p-3">
                        <p className="text-2xl font-black">{vote.abstainVotes}</p>
                        <p className="font-bold text-sm">ABSTAIN</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voting Actions */}
                <div className="lg:w-80">
                  {vote.hasVoted ? (
                    <div className="neo-card bg-green-400 text-black text-center">
                      <Trophy className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-xl font-black mb-2">VOTE SUBMITTED</p>
                      <p className="font-bold">YOU VOTED: {vote.userVote}</p>
                      <p className="text-sm">WITH 29 TOKENS</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="font-bold mb-2">YOUR VOTING POWER</p>
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="w-6 h-6" />
                          <span className="text-2xl font-black">{vote.userVotingPower} TOKENS</span>
                        </div>
                      </div>

                      {selectedVote === vote.id ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <button
                              onClick={() => setVoteChoice("YES")}
                              className={`w-full p-4 border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000] ${
                                voteChoice === "YES" ? "bg-green-400 text-black" : "bg-white text-black"
                              }`}
                            >
                              ✓ YES - APPROVE
                            </button>
                            <button
                              onClick={() => setVoteChoice("NO")}
                              className={`w-full p-4 border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000] ${
                                voteChoice === "NO" ? "bg-red-500 text-white" : "bg-white text-black"
                              }`}
                            >
                              ✗ NO - REJECT
                            </button>
                            <button
                              onClick={() => setVoteChoice("ABSTAIN")}
                              className={`w-full p-4 border-4 border-black font-bold shadow-[4px_4px_0px_0px_#000000] ${
                                voteChoice === "ABSTAIN" ? "bg-gray-400 text-black" : "bg-white text-black"
                              }`}
                            >
                              — ABSTAIN
                            </button>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVote(vote.id, voteChoice)}
                              disabled={!voteChoice}
                              className="neo-button-yellow flex-1 disabled:opacity-50"
                            >
                              SUBMIT VOTE
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVote(null)
                                setVoteChoice("")
                              }}
                              className="neo-button bg-gray-400 text-black"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedVote(vote.id)} className="neo-button-pink w-full">
                          <Vote className="w-5 h-5 mr-2" />
                          CAST VOTE
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voting Badges */}
        <div className="neo-card">
          <h2 className="neo-subtitle mb-6">VOTING BADGES</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`border-4 border-black p-4 ${badge.earned ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-600"}`}
              >
                <div className="flex items-center space-x-3">
                  <Trophy className={`w-8 h-8 ${badge.earned ? "text-black" : "text-gray-400"}`} />
                  <div>
                    <p className="font-black text-lg">{badge.name}</p>
                    <p className="text-sm font-bold">{badge.description}</p>
                  </div>
                  {badge.earned && (
                    <div className="ml-auto">
                      <span className="neo-badge bg-green-400 text-black">EARNED</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neo-card bg-yellow-400 text-black text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{activeVotes.length}</p>
            <p className="font-bold text-sm">ACTIVE VOTES</p>
          </div>

          <div className="neo-card bg-pink-500 text-white text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{votingStats.participationStreak}</p>
            <p className="font-bold text-sm">STREAK DAYS</p>
          </div>

          <div className="neo-card bg-cyan-400 text-black text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{votingStats.accuracyRate}%</p>
            <p className="font-bold text-sm">ACCURACY</p>
          </div>

          <div className="neo-card bg-green-400 text-black text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">{votingStats.votingPowerUsed}</p>
            <p className="font-bold text-sm">POWER USED</p>
          </div>
        </div>

        {/* Urgent Notice */}
        <div className="neo-card bg-red-500 text-white">
          <div className="flex items-center space-x-4">
            <AlertCircle className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-black uppercase">URGENT VOTE REQUIRED</h3>
              <p className="font-bold">QUARTERLY SHU DISTRIBUTION ends in 12 hours - Your participation needed!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
