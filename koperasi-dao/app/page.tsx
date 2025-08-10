"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Zap,
  Users,
  Coins,
  TrendingUp,
  QrCode,
  Wallet,
  Star,
  Trophy,
  Target,
  Building,
  Vote,
  CreditCard,
  DollarSign,
  Shield,
} from "lucide-react"

// Mock member data
const memberData = {
  id: "DAO-M-001",
  name: "AHMAD WIJAYA",
  joinDate: "2022-01-15",
  nftTokenId: "KOOP-NFT-#1337",
  simpananPokok: 500000,
  simpananWajib: 2400000,
  totalSimpanan: 2900000,
  votingPower: 29,
  membershipTier: "GOLD",
  participationStreak: 12,
  totalVotes: 47,
  proposalsCreated: 3,
}

const quickStats = [
  { label: "VOTING POWER", value: "29 TOKENS", color: "yellow", icon: Zap },
  { label: "TOTAL SAVINGS", value: "RP 2.9M", color: "pink", icon: Coins },
  { label: "PARTICIPATION", value: "12 STREAK", color: "cyan", icon: Trophy },
  { label: "PROPOSALS", value: "3 CREATED", color: "green", icon: Target },
]

const recentActivity = [
  { action: "VOTED YES", proposal: "TOKO KELONTONG EXPANSION", time: "2H AGO", color: "green" },
  { action: "CREATED PROPOSAL", proposal: "DIGITAL PAYMENT SYSTEM", time: "1D AGO", color: "yellow" },
  { action: "RECEIVED SHU", proposal: "QUARTERLY DISTRIBUTION", time: "3D AGO", color: "pink" },
  { action: "LOAN APPROVED", proposal: "BUSINESS CAPITAL", time: "1W AGO", color: "cyan" },
]

export default function MembershipDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="neo-title text-black">
            MEMBERSHIP
            <span className="block text-yellow-400">DASHBOARD</span>
          </h1>
          <p className="neo-text mono">BLOCKCHAIN-POWERED COOPERATIVE GOVERNANCE</p>
          <div className="mono text-sm font-bold">
            {currentTime.toLocaleDateString("ID")} • {currentTime.toLocaleTimeString("ID")}
          </div>
        </div>

        {/* Member Profile Card */}
        <div className="neo-card bg-gradient-to-r from-yellow-400 to-yellow-300 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black uppercase">{memberData.name}</h2>
                  <p className="mono font-bold">ID: {memberData.id}</p>
                  <p className="mono font-bold">NFT: {memberData.nftTokenId}</p>
                </div>
                <div className="neo-badge-pink">{memberData.membershipTier}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-sm">MEMBER SINCE</p>
                  <p className="text-2xl font-black">{new Date(memberData.joinDate).getFullYear()}</p>
                </div>
                <div>
                  <p className="font-bold text-sm">VOTING POWER</p>
                  <p className="text-2xl font-black">{memberData.votingPower} TOKENS</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <button onClick={() => setShowQR(!showQR)} className="neo-button-pink w-full">
                <QrCode className="w-5 h-5 mr-2" />
                MEMBER QR
              </button>

              {showQR && (
                <div className="neo-card bg-white text-black p-4">
                  <div className="w-32 h-32 bg-black flex items-center justify-center">
                    <div className="text-white text-xs mono text-center">
                      QR CODE
                      <br />
                      {memberData.id}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            const colorClass =
              stat.color === "yellow"
                ? "bg-yellow-400 text-black"
                : stat.color === "pink"
                  ? "bg-pink-500 text-white"
                  : stat.color === "cyan"
                    ? "bg-cyan-400 text-black"
                    : "bg-green-400 text-black"

            return (
              <div key={index} className={`neo-card ${colorClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8" />
                  <div className="text-right">
                    <p className="text-xs font-bold opacity-80">{stat.label}</p>
                    <p className="text-xl font-black">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Token Wallet & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="neo-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="neo-subtitle">TOKEN WALLET</h3>
              <Wallet className="w-8 h-8" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-yellow-400 border-4 border-black">
                <div>
                  <p className="font-bold text-sm">GOVERNANCE TOKENS</p>
                  <p className="text-2xl font-black">{memberData.votingPower}</p>
                </div>
                <Coins className="w-8 h-8" />
              </div>

              <div className="flex justify-between items-center p-4 bg-pink-500 text-white border-4 border-black">
                <div>
                  <p className="font-bold text-sm">TOTAL SAVINGS</p>
                  <p className="text-2xl font-black">RP {(memberData.totalSimpanan / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <button className="neo-button-yellow text-xs py-2">STAKE</button>
              <button className="neo-button-cyan text-xs py-2">WITHDRAW</button>
              <button className="neo-button-pink text-xs py-2">TRANSFER</button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="neo-card">
            <h3 className="neo-subtitle mb-6">RECENT ACTIVITY</h3>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const colorClass =
                  activity.color === "yellow"
                    ? "border-l-yellow-400"
                    : activity.color === "pink"
                      ? "border-l-pink-500"
                      : activity.color === "cyan"
                        ? "border-l-cyan-400"
                        : "border-l-green-400"

                return (
                  <div key={index} className={`border-l-8 ${colorClass} pl-4 py-2`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{activity.action}</p>
                        <p className="text-xs opacity-80">{activity.proposal}</p>
                      </div>
                      <span className="mono text-xs font-bold">{activity.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="neo-card">
          <h3 className="neo-subtitle mb-6">QUICK ACTIONS</h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/proposals" className="neo-button-yellow flex items-center justify-center space-x-2 py-4">
              <Building className="w-5 h-5" />
              <span>CREATE PROPOSAL</span>
            </Link>

            <Link href="/voting" className="neo-button-pink flex items-center justify-center space-x-2 py-4">
              <Vote className="w-5 h-5" />
              <span>VOTE NOW</span>
            </Link>

            <Link href="/loans" className="neo-button-cyan flex items-center justify-center space-x-2 py-4">
              <CreditCard className="w-5 h-5" />
              <span>APPLY LOAN</span>
            </Link>

            <Link
              href="/profits"
              className="neo-button bg-green-400 text-black flex items-center justify-center space-x-2 py-4"
            >
              <DollarSign className="w-5 h-5" />
              <span>VIEW PROFITS</span>
            </Link>

            <Link
              href="/audit"
              className="neo-button bg-purple-500 text-white flex items-center justify-center space-x-2 py-4"
            >
              <Shield className="w-5 h-5" />
              <span>AUDIT TRAIL</span>
            </Link>

            <Link
              href="/strategic"
              className="neo-button bg-red-500 text-white flex items-center justify-center space-x-2 py-4"
            >
              <Users className="w-5 h-5" />
              <span>STRATEGIC</span>
            </Link>
          </div>
        </div>

        {/* Membership Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="neo-card bg-cyan-400 text-black">
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-2" />
              <p className="text-3xl font-black">{memberData.participationStreak}</p>
              <p className="font-bold text-sm">PARTICIPATION STREAK</p>
            </div>
          </div>

          <div className="neo-card bg-pink-500 text-white">
            <div className="text-center">
              <Vote className="w-12 h-12 mx-auto mb-2" />
              <p className="text-3xl font-black">{memberData.totalVotes}</p>
              <p className="font-bold text-sm">TOTAL VOTES CAST</p>
            </div>
          </div>

          <div className="neo-card bg-green-400 text-black">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <p className="text-3xl font-black">{memberData.proposalsCreated}</p>
              <p className="font-bold text-sm">PROPOSALS CREATED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
