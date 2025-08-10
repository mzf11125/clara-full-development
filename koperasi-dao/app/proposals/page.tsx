"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ThumbsUp, ThumbsDown, Eye, Clock, DollarSign, TrendingUp, Filter, Search } from "lucide-react"

const proposalCategories = ["ALL", "FOOD", "TECH", "REAL ESTATE", "SERVICES", "MANUFACTURING"]

const mockProposals = [
  {
    id: "PROP-001",
    title: "DIGITAL WARUNG NETWORK",
    description:
      "Build a network of smart digital warungs with IoT inventory management and mobile payment integration across 10 locations.",
    category: "TECH",
    author: "SITI NURHALIZA",
    authorId: "DAO-M-023",
    potentialROI: 25,
    fundingNeeded: 150000000,
    upvotes: 47,
    downvotes: 8,
    views: 234,
    timeLeft: "5 DAYS",
    status: "ACTIVE",
    image: "/placeholder.svg?height=200&width=300&text=DIGITAL+WARUNG",
    tags: ["IoT", "Mobile Payment", "Retail"],
  },
  {
    id: "PROP-002",
    title: "ORGANIC FARM EXPANSION",
    description:
      "Expand our organic farming operations with hydroponic systems and direct-to-consumer delivery platform.",
    category: "FOOD",
    author: "BUDI SANTOSO",
    authorId: "DAO-M-012",
    potentialROI: 18,
    fundingNeeded: 75000000,
    upvotes: 32,
    downvotes: 12,
    views: 189,
    timeLeft: "3 DAYS",
    status: "ACTIVE",
    image: "/placeholder.svg?height=200&width=300&text=ORGANIC+FARM",
    tags: ["Organic", "Hydroponics", "Delivery"],
  },
  {
    id: "PROP-003",
    title: "CO-WORKING SPACE HUB",
    description:
      "Establish a modern co-working space with meeting rooms, high-speed internet, and business incubation programs.",
    category: "REAL ESTATE",
    author: "RINA DEWI",
    authorId: "DAO-M-034",
    potentialROI: 22,
    fundingNeeded: 200000000,
    upvotes: 28,
    downvotes: 15,
    views: 156,
    timeLeft: "1 WEEK",
    status: "ACTIVE",
    image: "/placeholder.svg?height=200&width=300&text=CO-WORKING+SPACE",
    tags: ["Co-working", "Incubation", "Real Estate"],
  },
  {
    id: "PROP-004",
    title: "MOBILE LAUNDRY SERVICE",
    description:
      "Launch a mobile laundry service with eco-friendly cleaning solutions and door-to-door pickup/delivery.",
    category: "SERVICES",
    author: "JOKO WIDODO",
    authorId: "DAO-M-045",
    potentialROI: 15,
    fundingNeeded: 45000000,
    upvotes: 19,
    downvotes: 6,
    views: 98,
    timeLeft: "2 WEEKS",
    status: "DRAFT",
    image: "/placeholder.svg?height=200&width=300&text=MOBILE+LAUNDRY",
    tags: ["Mobile Service", "Eco-friendly", "Delivery"],
  },
]

export default function ProposalBoard() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProposals = mockProposals.filter((proposal) => {
    const matchesCategory = selectedCategory === "ALL" || proposal.category === selectedCategory
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="neo-title text-black">
            PROPOSAL
            <span className="block text-pink-500">BOARD</span>
          </h1>
          <p className="neo-text mono">DEMOCRATIC BUSINESS INITIATIVE PLATFORM</p>
        </div>

        {/* Controls */}
        <div className="neo-card">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  placeholder="SEARCH PROPOSALS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neo-input w-full pl-12 uppercase placeholder:text-gray-500"
                />
              </div>

              <button onClick={() => setShowFilters(!showFilters)} className="neo-button-cyan">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <Link href="/proposals/create" className="neo-button-yellow">
              <Plus className="w-5 h-5 mr-2" />
              CREATE PROPOSAL
            </Link>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t-4 border-black">
              <p className="font-bold mb-4">CATEGORIES:</p>
              <div className="flex flex-wrap gap-2">
                {proposalCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 border-4 border-black font-bold text-sm shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150 ${
                      selectedCategory === category ? "bg-pink-500 text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="neo-card hover:shadow-[12px_12px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200"
            >
              {/* Proposal Image */}
              <div className="relative mb-4">
                <img
                  src={proposal.image || "/placeholder.svg"}
                  alt={proposal.title}
                  className="w-full h-48 object-cover border-4 border-black"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`neo-badge ${proposal.status === "ACTIVE" ? "bg-green-400" : "bg-yellow-400"} text-black`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="neo-badge-pink">{proposal.category}</span>
                </div>
              </div>

              {/* Proposal Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black uppercase mb-2">{proposal.title}</h3>
                  <p className="neo-text text-gray-700 line-clamp-3">{proposal.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {proposal.tags.map((tag, index) => (
                    <span key={index} className="neo-badge-cyan text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author & Stats */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">BY: {proposal.author}</p>
                    <p className="mono text-xs">{proposal.authorId}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-bold">{proposal.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{proposal.timeLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-400 border-4 border-black p-3 text-center">
                    <DollarSign className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">FUNDING NEEDED</p>
                    <p className="text-lg font-black">RP {(proposal.fundingNeeded / 1000000).toFixed(0)}M</p>
                  </div>
                  <div className="bg-green-400 border-4 border-black p-3 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">POTENTIAL ROI</p>
                    <p className="text-lg font-black">{proposal.potentialROI}%</p>
                  </div>
                </div>

                {/* Voting Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-600">{proposal.upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-600">{proposal.downvotes}</span>
                    </div>
                  </div>

                  <Link href={`/proposals/${proposal.id}`} className="neo-button-pink text-sm py-2">
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <div className="neo-card text-center py-12">
            <h3 className="neo-subtitle mb-4">NO PROPOSALS FOUND</h3>
            <p className="neo-text mb-6">Try adjusting your search or filters</p>
            <Link href="/proposals/create" className="neo-button-yellow">
              <Plus className="w-5 h-5 mr-2" />
              CREATE FIRST PROPOSAL
            </Link>
          </div>
        )}

        {/* Stats Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="neo-card bg-yellow-400 text-black text-center">
            <p className="text-3xl font-black">{mockProposals.length}</p>
            <p className="font-bold text-sm">TOTAL PROPOSALS</p>
          </div>
          <div className="neo-card bg-pink-500 text-white text-center">
            <p className="text-3xl font-black">{mockProposals.filter((p) => p.status === "ACTIVE").length}</p>
            <p className="font-bold text-sm">ACTIVE VOTING</p>
          </div>
          <div className="neo-card bg-cyan-400 text-black text-center">
            <p className="text-3xl font-black">{mockProposals.reduce((sum, p) => sum + p.upvotes, 0)}</p>
            <p className="font-bold text-sm">TOTAL UPVOTES</p>
          </div>
          <div className="neo-card bg-green-400 text-black text-center">
            <p className="text-3xl font-black">
              RP {(mockProposals.reduce((sum, p) => sum + p.fundingNeeded, 0) / 1000000000).toFixed(1)}B
            </p>
            <p className="font-bold text-sm">TOTAL FUNDING</p>
          </div>
        </div>
      </div>
    </div>
  )
}
