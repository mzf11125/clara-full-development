"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Vote, Clock, DollarSign, Users, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for the proposal
const proposalData = {
  id: "P001",
  title: "Pembukaan Toko Kelontong Cabang Baru",
  type: "business-initiative",
  proposer: "Siti Nurhaliza",
  proposerInfo: {
    id: "M023",
    joinDate: "2021-03-15",
    votingPower: 45,
    reputation: 4.8,
  },
  description:
    "Proposal pembukaan toko kelontong di area perumahan baru Griya Asri dengan modal awal Rp 50 juta. Lokasi strategis dengan potensi pelanggan 500+ keluarga. Proyeksi keuntungan 18% per tahun dengan ROI dalam 3 tahun.",
  details: {
    businessType: "Retail/Toko",
    investmentAmount: 50000000,
    expectedReturn: 18,
    timeline: "3 Bulan",
    location: "Perumahan Griya Asri, Blok C",
    marketAnalysis: "Area dengan 500+ keluarga, tidak ada toko kelontong dalam radius 1km",
  },
  voting: {
    requiredVotes: 100,
    currentVotes: 67,
    yesVotes: 52,
    noVotes: 15,
    abstainVotes: 0,
    quorum: 60,
    currentParticipation: 67,
  },
  endDate: "2024-01-20T23:59:59",
  status: "active",
  comments: [
    {
      id: "C001",
      author: "Budi Santoso",
      authorId: "M012",
      content:
        "Lokasi sangat strategis, saya setuju dengan proposal ini. Sudah melakukan survey sendiri dan memang area tersebut membutuhkan toko kelontong.",
      timestamp: "2024-01-16T10:30:00",
      vote: "yes",
    },
    {
      id: "C002",
      author: "Rina Dewi",
      authorId: "M034",
      content: "Apakah sudah ada analisis kompetitor? Bagaimana dengan toko-toko online yang semakin populer?",
      timestamp: "2024-01-16T14:15:00",
      vote: "abstain",
    },
  ],
}

export default function ProposalDetail({ params }: { params: { id: string } }) {
  const [userVote, setUserVote] = useState("")
  const [comment, setComment] = useState("")
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (!userVote) return

    // Simulate voting
    setHasVoted(true)
    alert(`Vote "${userVote}" berhasil disubmit dengan 29 voting tokens!`)
  }

  const handleComment = () => {
    if (!comment.trim()) return

    // Simulate adding comment
    alert("Komentar berhasil ditambahkan!")
    setComment("")
  }

  const timeRemaining = () => {
    const end = new Date(proposalData.endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days} hari ${hours} jam`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{proposalData.title}</h1>
              <Badge variant={proposalData.type === "business-initiative" ? "default" : "destructive"}>
                {proposalData.type === "business-initiative" ? "Usaha Baru" : "M&A"}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                {proposalData.status === "active" ? "Aktif" : "Selesai"}
              </Badge>
            </div>
            <p className="text-gray-600">
              Proposal ID: {proposalData.id} • Diajukan oleh: {proposalData.proposer}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Proposal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{proposalData.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Jenis Usaha</Label>
                    <p className="font-medium">{proposalData.details.businessType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Modal Dibutuhkan</Label>
                    <p className="font-medium">Rp {proposalData.details.investmentAmount.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Proyeksi Keuntungan</Label>
                    <p className="font-medium">{proposalData.details.expectedReturn}% per tahun</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Timeline</Label>
                    <p className="font-medium">{proposalData.details.timeline}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Analisis Pasar</h4>
                  <p className="text-blue-800 text-sm">{proposalData.details.marketAnalysis}</p>
                </div>
              </CardContent>
            </Card>

            {/* Voting Section */}
            {!hasVoted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Cast Your Vote
                  </CardTitle>
                  <CardDescription>Voting power Anda: 29 tokens (berdasarkan simpanan)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={userVote} onValueChange={setUserVote}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-700">Setuju (YES)</p>
                            <p className="text-sm text-gray-600">Mendukung proposal ini</p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-700">Tidak Setuju (NO)</p>
                            <p className="text-sm text-gray-600">Menolak proposal ini</p>
                          </div>
                          <span className="text-red-600">✕</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="abstain" id="abstain" />
                      <Label htmlFor="abstain" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Abstain</p>
                            <p className="text-sm text-gray-600">Tidak mengambil posisi</p>
                          </div>
                          <span className="text-gray-600">—</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <Button onClick={handleVote} disabled={!userVote} className="w-full">
                    Submit Vote (29 Tokens)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Diskusi & Komentar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment">Tambah Komentar</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Berikan pendapat atau pertanyaan Anda tentang proposal ini..."
                    rows={3}
                  />
                  <Button onClick={handleComment} disabled={!comment.trim()}>
                    Kirim Komentar
                  </Button>
                </div>

                <hr />

                {/* Comments List */}
                <div className="space-y-4">
                  {proposalData.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <Badge variant="outline" size="sm">
                            {comment.authorId}
                          </Badge>
                          {comment.vote && (
                            <Badge
                              variant={
                                comment.vote === "yes" ? "default" : comment.vote === "no" ? "destructive" : "secondary"
                              }
                              size="sm"
                            >
                              {comment.vote === "yes" ? "Voted YES" : comment.vote === "no" ? "Voted NO" : "Abstain"}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  Status Voting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((proposalData.voting.currentVotes / proposalData.voting.requiredVotes) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Progress Voting</p>
                </div>

                <Progress value={(proposalData.voting.currentVotes / proposalData.voting.requiredVotes) * 100} />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Votes:</span>
                    <span className="font-medium">
                      {proposalData.voting.currentVotes}/{proposalData.voting.requiredVotes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participation:</span>
                    <span className="font-medium">{proposalData.voting.currentParticipation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quorum Required:</span>
                    <span className="font-medium">{proposalData.voting.quorum}%</span>
                  </div>
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">✓ Setuju</span>
                    <span className="font-medium">{proposalData.voting.yesVotes} votes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">✕ Tidak Setuju</span>
                    <span className="font-medium">{proposalData.voting.noVotes} votes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">— Abstain</span>
                    <span className="font-medium">{proposalData.voting.abstainVotes} votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Remaining */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Waktu Tersisa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{timeRemaining()}</div>
                  <p className="text-sm text-gray-600">
                    Berakhir: {new Date(proposalData.endDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Proposer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Info Pengusul
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{proposalData.proposer}</p>
                  <p className="text-sm text-gray-600">ID: {proposalData.proposerInfo.id}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span>{new Date(proposalData.proposerInfo.joinDate).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voting Power:</span>
                    <span>{proposalData.proposerInfo.votingPower} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reputation:</span>
                    <span>⭐ {proposalData.proposerInfo.reputation}/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Dampak Finansial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Modal Awal:</span>
                    <span className="font-medium">Rp 50M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proyeksi Keuntungan:</span>
                    <span className="font-medium text-green-600">+18%/tahun</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI Period:</span>
                    <span className="font-medium">3 tahun</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Level:</span>
                    <span className="font-medium text-yellow-600">Medium</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
