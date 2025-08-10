"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, FileText, DollarSign, Building2, Users } from "lucide-react"
import Link from "next/link"

export default function CreateProposal() {
  const [proposalType, setProposalType] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessType: "",
    investmentAmount: "",
    expectedReturn: "",
    timeline: "",
    riskAssessment: "",
    mergerPartner: "",
    mergerReason: "",
    votingDuration: "7",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle proposal submission
    console.log("Proposal submitted:", { type: proposalType, ...formData })
    alert("Proposal berhasil diajukan! Akan masuk ke sistem voting dalam 24 jam.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buat Proposal Baru</h1>
            <p className="text-gray-600">Ajukan inisiatif untuk voting demokratis</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proposal Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Jenis Proposal
              </CardTitle>
              <CardDescription>Pilih jenis proposal yang akan diajukan</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={proposalType} onValueChange={setProposalType}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="business-initiative" id="business" />
                    <Label htmlFor="business" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Inisiatif Usaha</p>
                        <p className="text-sm text-gray-500">Usaha atau investasi baru</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="merger-acquisition" id="merger" />
                    <Label htmlFor="merger" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Merger & Akuisisi</p>
                        <p className="text-sm text-gray-500">Penggabungan koperasi</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="governance-change" id="governance" />
                    <Label htmlFor="governance" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Perubahan Governance</p>
                        <p className="text-sm text-gray-500">Aturan dan kebijakan</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Detail umum proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Proposal *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul proposal yang jelas dan deskriptif"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi Lengkap *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail proposal, tujuan, manfaat, dan dampaknya bagi koperasi"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditional Fields Based on Proposal Type */}
          {proposalType === "business-initiative" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Detail Inisiatif Usaha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessType">Jenis Usaha</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis usaha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail/Toko</SelectItem>
                        <SelectItem value="food">Makanan & Minuman</SelectItem>
                        <SelectItem value="service">Jasa</SelectItem>
                        <SelectItem value="manufacturing">Manufaktur</SelectItem>
                        <SelectItem value="agriculture">Pertanian</SelectItem>
                        <SelectItem value="technology">Teknologi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="investmentAmount">Modal yang Dibutuhkan (Rp)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      value={formData.investmentAmount}
                      onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                      placeholder="50000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedReturn">Proyeksi Keuntungan Tahunan (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      value={formData.expectedReturn}
                      onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Timeline Implementasi</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 Bulan</SelectItem>
                        <SelectItem value="3-months">3 Bulan</SelectItem>
                        <SelectItem value="6-months">6 Bulan</SelectItem>
                        <SelectItem value="1-year">1 Tahun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="riskAssessment">Analisis Risiko</Label>
                  <Textarea
                    id="riskAssessment"
                    value={formData.riskAssessment}
                    onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
                    placeholder="Jelaskan potensi risiko dan strategi mitigasinya"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {proposalType === "merger-acquisition" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detail Merger & Akuisisi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mergerPartner">Nama Koperasi Partner</Label>
                  <Input
                    id="mergerPartner"
                    value={formData.mergerPartner}
                    onChange={(e) => setFormData({ ...formData, mergerPartner: e.target.value })}
                    placeholder="Koperasi Sejahtera Mandiri"
                  />
                </div>

                <div>
                  <Label htmlFor="mergerReason">Alasan dan Manfaat Merger</Label>
                  <Textarea
                    id="mergerReason"
                    value={formData.mergerReason}
                    onChange={(e) => setFormData({ ...formData, mergerReason: e.target.value })}
                    placeholder="Jelaskan mengapa merger ini menguntungkan dan bagaimana dampaknya bagi anggota"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Voting Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Voting</CardTitle>
              <CardDescription>Pengaturan proses voting untuk proposal ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="votingDuration">Durasi Voting (hari)</Label>
                <Select
                  value={formData.votingDuration}
                  onValueChange={(value) => setFormData({ ...formData, votingDuration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Hari</SelectItem>
                    <SelectItem value="7">7 Hari (Recommended)</SelectItem>
                    <SelectItem value="14">14 Hari</SelectItem>
                    <SelectItem value="30">30 Hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Persyaratan Voting</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="quorum" defaultChecked />
                    <Label htmlFor="quorum" className="text-sm">
                      Minimal 60% anggota aktif harus berpartisipasi (Quorum)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="majority" defaultChecked />
                    <Label htmlFor="majority" className="text-sm">
                      Memerlukan mayoritas sederhana ({">"} 50%) untuk disetujui
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="weighted" defaultChecked />
                    <Label htmlFor="weighted" className="text-sm">
                      Menggunakan weighted voting berdasarkan simpanan
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button variant="outline">Batal</Button>
            </Link>
            <Button type="submit" disabled={!proposalType || !formData.title || !formData.description}>
              Ajukan Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
