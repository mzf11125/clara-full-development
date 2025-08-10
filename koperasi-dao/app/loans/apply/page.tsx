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
import { ArrowLeft, DollarSign, FileText, Users, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoanApplication() {
  const [loanData, setLoanData] = useState({
    amount: "",
    purpose: "",
    loanType: "",
    duration: "",
    description: "",
    collateral: "",
    monthlyIncome: "",
    businessPlan: "",
    guarantor1: "",
    guarantor2: "",
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert("Harap setujui syarat dan ketentuan terlebih dahulu")
      return
    }
    alert("Aplikasi pinjaman berhasil diajukan! Akan masuk ke sistem voting komunitas dalam 24 jam.")
  }

  const calculateMonthlyPayment = () => {
    if (loanData.amount && loanData.duration) {
      const principal = Number.parseInt(loanData.amount)
      const months = Number.parseInt(loanData.duration)
      const interestRate = 0.12 / 12 // 12% annual rate
      const monthlyPayment =
        (principal * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1)
      return monthlyPayment.toFixed(0)
    }
    return "0"
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
            <h1 className="text-3xl font-bold text-gray-900">Ajukan Pinjaman</h1>
            <p className="text-gray-600">Sistem P2P lending dengan persetujuan komunitas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informasi Pinjaman
              </CardTitle>
              <CardDescription>Detail dasar pinjaman yang diajukan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Jumlah Pinjaman (Rp) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={loanData.amount}
                    onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                    placeholder="5000000"
                    min="1000000"
                    max="100000000"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum Rp 1,000,000 - Maximum Rp 100,000,000</p>
                </div>

                <div>
                  <Label htmlFor="duration">Jangka Waktu (bulan) *</Label>
                  <Select
                    value={loanData.duration}
                    onValueChange={(value) => setLoanData({ ...loanData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jangka waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Bulan</SelectItem>
                      <SelectItem value="12">12 Bulan</SelectItem>
                      <SelectItem value="18">18 Bulan</SelectItem>
                      <SelectItem value="24">24 Bulan</SelectItem>
                      <SelectItem value="36">36 Bulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tujuan Pinjaman *</Label>
                <RadioGroup
                  value={loanData.loanType}
                  onValueChange={(value) => setLoanData({ ...loanData, loanType: value })}
                >
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Modal Usaha</p>
                          <p className="text-sm text-gray-500">Untuk memulai atau mengembangkan usaha</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="education" id="education" />
                      <Label htmlFor="education" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Pendidikan</p>
                          <p className="text-sm text-gray-500">Biaya sekolah, kuliah, atau kursus</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="emergency" id="emergency" />
                      <Label htmlFor="emergency" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Darurat</p>
                          <p className="text-sm text-gray-500">Kebutuhan mendesak atau kesehatan</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="consumption" id="consumption" />
                      <Label htmlFor="consumption" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Konsumtif</p>
                          <p className="text-sm text-gray-500">Kebutuhan pribadi atau keluarga</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi Detail *</Label>
                <Textarea
                  id="description"
                  value={loanData.description}
                  onChange={(e) => setLoanData({ ...loanData, description: e.target.value })}
                  placeholder="Jelaskan secara detail untuk apa pinjaman ini akan digunakan dan bagaimana rencana pembayarannya"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Keuangan</CardTitle>
              <CardDescription>Data keuangan untuk penilaian kelayakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Penghasilan Bulanan (Rp) *</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={loanData.monthlyIncome}
                    onChange={(e) => setLoanData({ ...loanData, monthlyIncome: e.target.value })}
                    placeholder="3000000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="collateral">Jaminan/Agunan</Label>
                  <Input
                    id="collateral"
                    value={loanData.collateral}
                    onChange={(e) => setLoanData({ ...loanData, collateral: e.target.value })}
                    placeholder="BPKB Motor, Sertifikat Tanah, dll"
                  />
                </div>
              </div>

              {loanData.loanType === "business" && (
                <div>
                  <Label htmlFor="businessPlan">Rencana Bisnis</Label>
                  <Textarea
                    id="businessPlan"
                    value={loanData.businessPlan}
                    onChange={(e) => setLoanData({ ...loanData, businessPlan: e.target.value })}
                    placeholder="Jelaskan rencana bisnis, target pasar, proyeksi keuntungan, dll"
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guarantors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Penjamin
              </CardTitle>
              <CardDescription>Minimal 2 anggota koperasi sebagai penjamin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guarantor1">Penjamin 1 (ID Anggota) *</Label>
                  <Input
                    id="guarantor1"
                    value={loanData.guarantor1}
                    onChange={(e) => setLoanData({ ...loanData, guarantor1: e.target.value })}
                    placeholder="M023"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="guarantor2">Penjamin 2 (ID Anggota) *</Label>
                  <Input
                    id="guarantor2"
                    value={loanData.guarantor2}
                    onChange={(e) => setLoanData({ ...loanData, guarantor2: e.target.value })}
                    placeholder="M045"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Persyaratan Penjamin</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Harus anggota aktif koperasi minimal 1 tahun</li>
                      <li>• Memiliki voting power minimal 20 tokens</li>
                      <li>• Tidak memiliki tunggakan pinjaman</li>
                      <li>• Bersedia bertanggung jawab atas pinjaman</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Summary */}
          {loanData.amount && loanData.duration && (
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pinjaman</CardTitle>
                <CardDescription>Simulasi pembayaran dan persetujuan yang dibutuhkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Jumlah Pinjaman</p>
                    <p className="font-bold text-lg">Rp {Number.parseInt(loanData.amount).toLocaleString("id-ID")}</p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Cicilan Bulanan</p>
                    <p className="font-bold text-lg">
                      Rp {Number.parseInt(calculateMonthlyPayment()).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-600">Suku Bunga</p>
                    <p className="font-bold text-lg">12% / tahun</p>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Persetujuan Dibutuhkan</p>
                    <p className="font-bold text-lg">{Math.ceil(Number.parseInt(loanData.amount) / 1000000)} anggota</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Proses Persetujuan:</h4>
                  <ol className="text-sm space-y-1">
                    <li>1. Verifikasi dokumen dan penjamin (1-2 hari)</li>
                    <li>2. Voting komunitas (7 hari)</li>
                    <li>3. Pencairan dana jika disetujui (1 hari)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Syarat dan Ketentuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <p>
                  <strong>Dengan mengajukan pinjaman ini, saya menyetujui:</strong>
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Memberikan informasi yang benar dan dapat dipertanggungjawabkan</li>
                  <li>• Mengikuti proses voting demokratis dari komunitas anggota</li>
                  <li>• Membayar cicilan tepat waktu sesuai jadwal yang disepakati</li>
                  <li>• Memberikan laporan penggunaan dana jika untuk modal usaha</li>
                  <li>• Menerima konsekuensi jika terjadi keterlambatan pembayaran</li>
                  <li>• Memahami bahwa penjamin ikut bertanggung jawab atas pinjaman</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                <Label htmlFor="terms" className="text-sm">
                  Saya telah membaca dan menyetujui semua syarat dan ketentuan di atas
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button variant="outline">Batal</Button>
            </Link>
            <Button
              type="submit"
              disabled={
                !loanData.amount ||
                !loanData.loanType ||
                !loanData.description ||
                !loanData.monthlyIncome ||
                !loanData.guarantor1 ||
                !loanData.guarantor2 ||
                !agreedToTerms
              }
            >
              Ajukan Pinjaman
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
