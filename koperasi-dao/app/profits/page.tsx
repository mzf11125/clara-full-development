"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, PieChart, BarChart3, Coins, Users, Calendar, Download } from "lucide-react"

const profitData = {
  totalSHU: 270000000,
  memberShare: 1250000,
  growthRate: 15.3,
  distributionDate: "2024-01-15",
  nextDistribution: "2024-04-15",
}

const distributionBreakdown = [
  { category: "JASA SIMPANAN", percentage: 40, amount: 108000000, color: "bg-yellow-400" },
  { category: "JASA USAHA", percentage: 35, amount: 94500000, color: "bg-pink-500" },
  { category: "DANA CADANGAN", percentage: 15, amount: 40500000, color: "bg-cyan-400" },
  { category: "DANA SOSIAL", percentage: 10, amount: 27000000, color: "bg-green-400" },
]

const historicalData = [
  { period: "Q4 2024", shu: 270000000, memberShare: 1250000, growth: 15.3 },
  { period: "Q3 2024", shu: 234000000, memberShare: 1080000, growth: 12.1 },
  { period: "Q2 2024", shu: 208000000, memberShare: 960000, growth: 8.7 },
  { period: "Q1 2024", shu: 191000000, memberShare: 880000, growth: 6.2 },
]

const businessUnits = [
  { name: "TOKO KELONTONG", revenue: 180000000, profit: 27000000, contribution: 10 },
  { name: "UNIT SIMPAN PINJAM", revenue: 120000000, profit: 84000000, contribution: 31 },
  { name: "WARUNG MAKAN", revenue: 95000000, profit: 14250000, contribution: 5.3 },
  { name: "JASA LAUNDRY", revenue: 55000000, profit: 11000000, contribution: 4.1 },
]

const memberDistribution = [
  { tier: "PLATINUM", members: 12, avgShare: 2500000, totalShare: 30000000 },
  { tier: "GOLD", members: 45, avgShare: 1800000, totalShare: 81000000 },
  { tier: "SILVER", members: 98, avgShare: 1200000, totalShare: 117600000 },
  { tier: "BRONZE", members: 92, avgShare: 800000, totalShare: 73600000 },
]

export default function ProfitDistributionCenter() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4 2024")
  const [viewMode, setViewMode] = useState("OVERVIEW")

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="neo-title text-black">
            PROFIT &<span className="block text-green-400">DISTRIBUTION</span>
          </h1>
          <p className="neo-text mono">TRANSPARENT SHU SHARING ALGORITHM</p>
        </div>

        {/* Main Stats */}
        <div className="neo-card bg-gradient-to-r from-green-400 to-green-300 text-black">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black uppercase mb-2">YOUR SHU SHARE</h2>
              <div className="flex items-center space-x-4">
                <DollarSign className="w-12 h-12" />
                <div>
                  <p className="text-4xl font-black">RP {(profitData.memberShare / 1000000).toFixed(1)}M</p>
                  <p className="font-bold">FROM TOTAL RP {(profitData.totalSHU / 1000000).toFixed(0)}M TOTAL</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black">+{profitData.growthRate}%</p>
                <p className="font-bold text-sm">GROWTH</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">Q4</p>
                <p className="font-bold text-sm">2024</p>
              </div>
            </div>

            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-sm">NEXT DISTRIBUTION</p>
              <p className="text-lg font-black">{profitData.nextDistribution}</p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="neo-card">
          <div className="flex flex-wrap gap-2">
            {["OVERVIEW", "BREAKDOWN", "HISTORY", "BUSINESS UNITS"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 border-4 border-black font-bold text-sm shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150 ${
                  viewMode === mode ? "bg-green-400 text-black" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === "OVERVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution Algorithm */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">SHU DISTRIBUTION ALGORITHM</h3>

              <div className="space-y-4">
                {distributionBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{item.category}</span>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                    <div className="neo-progress">
                      <div
                        className={`h-full ${item.color} border-r-4 border-black transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">RP {(item.amount / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-400 border-4 border-black">
                <h4 className="font-black mb-2">YOUR CALCULATION:</h4>
                <div className="mono text-sm space-y-1">
                  <p>Simpanan Share: (2.9M / 1.25B) × 108M = RP 251K</p>
                  <p>Usaha Share: (15M / 300M) × 94.5M = RP 4.7M</p>
                  <p className="font-black text-lg">TOTAL: RP 1.25M</p>
                </div>
              </div>
            </div>

            {/* Real-time Profit Graph */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">PROFIT TREND</h3>

              <div className="space-y-4">
                {historicalData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-100 border-4 border-black">
                    <div>
                      <p className="font-bold">{data.period}</p>
                      <p className="text-sm">RP {(data.memberShare / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-green-600">+{data.growth}%</p>
                      <BarChart3 className="w-6 h-6 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>

              <button className="neo-button-cyan w-full mt-4">
                <Download className="w-5 h-5 mr-2" />
                DOWNLOAD REPORT
              </button>
            </div>
          </div>
        )}

        {viewMode === "BREAKDOWN" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Member Tier Distribution */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">MEMBER TIER DISTRIBUTION</h3>

              <div className="space-y-4">
                {memberDistribution.map((tier, index) => {
                  const colors = [
                    "bg-purple-500 text-white",
                    "bg-yellow-400 text-black",
                    "bg-gray-400 text-black",
                    "bg-orange-400 text-black",
                  ]
                  return (
                    <div key={index} className={`neo-card ${colors[index]}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-black">{tier.tier}</h4>
                          <p className="font-bold">{tier.members} MEMBERS</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black">RP {(tier.avgShare / 1000000).toFixed(1)}M</p>
                          <p className="font-bold text-sm">AVG SHARE</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="neo-progress">
                          <div
                            className="neo-progress-fill bg-white"
                            style={{ width: `${(tier.totalShare / 302200000) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-center font-bold mt-2">
                          TOTAL: RP {(tier.totalShare / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Transaction Explorer */}
            <div className="neo-card">
              <h3 className="neo-subtitle mb-6">BLOCKCHAIN TRANSACTIONS</h3>

              <div className="space-y-3">
                <div className="p-4 bg-green-100 border-4 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">SHU DISTRIBUTION</p>
                      <p className="mono text-xs">0x1a2b3c4d5e6f...</p>
                    </div>
                    <span className="neo-badge bg-green-400 text-black">CONFIRMED</span>
                  </div>
                  <p className="font-black text-lg mt-2">RP 1,250,000</p>
                </div>

                <div className="p-4 bg-yellow-100 border-4 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">PROFIT CALCULATION</p>
                      <p className="mono text-xs">0x2b3c4d5e6f7a...</p>
                    </div>
                    <span className="neo-badge bg-yellow-400 text-black">PENDING</span>
                  </div>
                  <p className="font-black text-lg mt-2">ALGORITHM EXECUTION</p>
                </div>

                <div className="p-4 bg-blue-100 border-4 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">RESERVE ALLOCATION</p>
                      <p className="mono text-xs">0x3c4d5e6f7a8b...</p>
                    </div>
                    <span className="neo-badge bg-blue-500 text-white">CONFIRMED</span>
                  </div>
                  <p className="font-black text-lg mt-2">RP 40,500,000</p>
                </div>
              </div>

              <button className="neo-button-pink w-full mt-4">
                <PieChart className="w-5 h-5 mr-2" />
                VIEW ALL TRANSACTIONS
              </button>
            </div>
          </div>
        )}

        {viewMode === "BUSINESS UNITS" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {businessUnits.map((unit, index) => (
              <div
                key={index}
                className="neo-card hover:shadow-[12px_12px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200"
              >
                <h4 className="text-xl font-black uppercase mb-4">{unit.name}</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-100 border-4 border-black">
                    <p className="font-bold text-sm">REVENUE</p>
                    <p className="text-lg font-black">RP {(unit.revenue / 1000000).toFixed(0)}M</p>
                  </div>
                  <div className="text-center p-3 bg-green-100 border-4 border-black">
                    <p className="font-bold text-sm">PROFIT</p>
                    <p className="text-lg font-black">RP {(unit.profit / 1000000).toFixed(1)}M</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold">CONTRIBUTION TO SHU</span>
                    <span className="font-bold">{unit.contribution}%</span>
                  </div>
                  <div className="neo-progress">
                    <div className="neo-progress-fill bg-green-400" style={{ width: `${unit.contribution}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neo-card bg-yellow-400 text-black text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">RP {(profitData.totalSHU / 1000000).toFixed(0)}M</p>
            <p className="font-bold text-sm">TOTAL SHU</p>
          </div>

          <div className="neo-card bg-pink-500 text-white text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">+{profitData.growthRate}%</p>
            <p className="font-bold text-sm">GROWTH RATE</p>
          </div>

          <div className="neo-card bg-cyan-400 text-black text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">247</p>
            <p className="font-bold text-sm">MEMBERS PAID</p>
          </div>

          <div className="neo-card bg-green-400 text-black text-center">
            <Coins className="w-8 h-8 mx-auto mb-2" />
            <p className="text-2xl font-black">100%</p>
            <p className="font-bold text-sm">DISTRIBUTED</p>
          </div>
        </div>

        {/* Auto Distribution Notice */}
        <div className="neo-card bg-gradient-to-r from-purple-500 to-purple-400 text-white">
          <div className="flex items-center space-x-4">
            <PieChart className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-black uppercase">AUTOMATIC DISTRIBUTION</h3>
              <p className="font-bold">Next SHU calculation and distribution: {profitData.nextDistribution}</p>
              <p className="text-sm opacity-90">Smart contract will execute profit-sharing algorithm automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
