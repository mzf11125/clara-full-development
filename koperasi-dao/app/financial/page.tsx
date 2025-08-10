"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, DollarSign, TrendingUp, PieChart, Calculator, Users, Building2 } from "lucide-react"
import Link from "next/link"

// Mock financial data
const financialData = {
  totalAssets: 2500000000,
  totalLiabilities: 800000000,
  netWorth: 1700000000,
  totalSimpanan: 1250000000,
  totalPinjaman: 650000000,
  pendapatanTahunIni: 450000000,
  biayaOperasional: 180000000,
  shuTahunIni: 270000000,
}

const shuDistribution = {
  jasaSimpanan: { percentage: 40, amount: 108000000 },
  jasaUsaha: { percentage: 35, amount: 94500000 },
  danaCadangan: { percentage: 15, amount: 40500000 },
  danaSosial: { percentage: 10, amount: 27000000 },
}

const memberSHU = [
  {
    id: "M001",
    name: "Ahmad Wijaya",
    simpanan: 2900000,
    usaha: 15000000,
    shuSimpanan: 1160,
    shuUsaha: 47250,
    totalSHU: 48410,
  },
  {
    id: "M002",
    name: "Siti Nurhaliza",
    simpanan: 5000000,
    usaha: 25000000,
    shuSimpanan: 2000,
    shuUsaha: 78750,
    totalSHU: 80750,
  },
  {
    id: "M003",
    name: "Budi Santoso",
    simpanan: 2300000,
    usaha: 8000000,
    shuSimpanan: 920,
    shuUsaha: 25200,
    totalSHU: 26120,
  },
  {
    id: "M004",
    name: "Rina Dewi",
    simpanan: 1100000,
    usaha: 5000000,
    shuSimpanan: 440,
    shuUsaha: 15750,
    totalSHU: 16190,
  },
]

const businessUnits = [
  {
    id: "BU001",
    name: "Toko Kelontong Utama",
    type: "Retail",
    revenue: 180000000,
    profit: 27000000,
    profitMargin: 15,
    status: "active",
  },
  {
    id: "BU002",
    name: "Unit Simpan Pinjam",
    type: "Financial Services",
    revenue: 120000000,
    profit: 84000000,
    profitMargin: 70,
    status: "active",
  },
  {
    id: "BU003",
    name: "Warung Makan Sejahtera",
    type: "Food & Beverage",
    revenue: 95000000,
    profit: 14250000,
    profitMargin: 15,
    status: "active",
  },
  {
    id: "BU004",
    name: "Jasa Laundry",
    type: "Services",
    revenue: 55000000,
    profit: 11000000,
    profitMargin: 20,
    status: "active",
  },
]

export default function FinancialManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")

  const calculateSHU = () => {
    alert("Kalkulasi SHU otomatis berhasil dijalankan! Distribusi akan dilakukan dalam 24 jam.")
  }

  const distributeSHU = () => {
    alert("SHU berhasil didistribusikan ke semua anggota berdasarkan algoritma yang telah ditetapkan!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Keuangan</h1>
            <p className="text-gray-600">Sistem otomatis kalkulasi dan distribusi SHU</p>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(financialData.totalAssets / 1000000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">+12% dari tahun lalu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(financialData.pendapatanTahunIni / 1000000).toFixed(0)}M</div>
              <p className="text-xs text-muted-foreground">Tahun {selectedPeriod}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SHU Tahun Ini</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(financialData.shuTahunIni / 1000000).toFixed(0)}M</div>
              <p className="text-xs text-muted-foreground">Siap distribusi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(financialData.netWorth / 1000000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Aset - Kewajiban</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="shu-distribution" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shu-distribution">Distribusi SHU</TabsTrigger>
            <TabsTrigger value="business-units">Unit Usaha</TabsTrigger>
            <TabsTrigger value="financial-reports">Laporan Keuangan</TabsTrigger>
            <TabsTrigger value="shu-calculator">Kalkulator SHU</TabsTrigger>
          </TabsList>

          <TabsContent value="shu-distribution" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SHU Distribution Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribusi SHU {selectedPeriod}
                  </CardTitle>
                  <CardDescription>Total SHU: Rp {financialData.shuTahunIni.toLocaleString("id-ID")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm">Jasa Simpanan ({shuDistribution.jasaSimpanan.percentage}%)</span>
                      </div>
                      <span className="font-medium">
                        Rp {(shuDistribution.jasaSimpanan.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress value={shuDistribution.jasaSimpanan.percentage} className="h-2" />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Jasa Usaha ({shuDistribution.jasaUsaha.percentage}%)</span>
                      </div>
                      <span className="font-medium">Rp {(shuDistribution.jasaUsaha.amount / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress value={shuDistribution.jasaUsaha.percentage} className="h-2" />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Dana Cadangan ({shuDistribution.danaCadangan.percentage}%)</span>
                      </div>
                      <span className="font-medium">
                        Rp {(shuDistribution.danaCadangan.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress value={shuDistribution.danaCadangan.percentage} className="h-2" />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-sm">Dana Sosial ({shuDistribution.danaSosial.percentage}%)</span>
                      </div>
                      <span className="font-medium">
                        Rp {(shuDistribution.danaSosial.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress value={shuDistribution.danaSosial.percentage} className="h-2" />
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button onClick={calculateSHU} className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" />
                      Hitung Ulang SHU
                    </Button>
                    <Button onClick={distributeSHU} variant="outline" className="flex-1 bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Distribusi Sekarang
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Member SHU Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>SHU Per Anggota (Preview)</CardTitle>
                  <CardDescription>Kalkulasi otomatis berdasarkan simpanan dan transaksi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {memberSHU.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">
                            Simpanan: Rp {member.simpanan.toLocaleString("id-ID")} • Usaha: Rp{" "}
                            {member.usaha.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">Rp {member.totalSHU.toLocaleString("id-ID")}</p>
                          <p className="text-xs text-gray-500">
                            Simpanan: {member.shuSimpanan.toLocaleString("id-ID")} + Usaha:{" "}
                            {member.shuUsaha.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Semua Anggota (247)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business-units" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unit Usaha Koperasi</CardTitle>
                <CardDescription>Performa dan kontribusi setiap unit usaha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {businessUnits.map((unit) => (
                    <div key={unit.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{unit.name}</h4>
                          <p className="text-sm text-gray-600">
                            {unit.type} • ID: {unit.id}
                          </p>
                        </div>
                        <Badge variant={unit.status === "active" ? "default" : "secondary"}>
                          {unit.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Pendapatan</p>
                          <p className="font-bold text-lg">Rp {(unit.revenue / 1000000).toFixed(0)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Keuntungan</p>
                          <p className="font-bold text-lg text-green-600">Rp {(unit.profit / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Margin</p>
                          <p className="font-bold text-lg">{unit.profitMargin}%</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kontribusi terhadap total profit</span>
                          <span>{((unit.profit / financialData.shuTahunIni) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(unit.profit / financialData.shuTahunIni) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial-reports" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neraca Keuangan</CardTitle>
                  <CardDescription>Posisi keuangan per {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">ASET</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Kas dan Bank</span>
                        <span>Rp {(500000000).toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Piutang Anggota</span>
                        <span>Rp {(650000000).toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inventaris</span>
                        <span>Rp {(350000000).toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aset Tetap</span>
                        <span>Rp {(1000000000).toLocaleString("id-ID")}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total Aset</span>
                        <span>Rp {financialData.totalAssets.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">KEWAJIBAN & MODAL</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Simpanan Anggota</span>
                        <span>Rp {financialData.totalSimpanan.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kewajiban Lain</span>
                        <span>
                          Rp {(financialData.totalLiabilities - financialData.totalSimpanan).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modal Koperasi</span>
                        <span>Rp {(450000000).toLocaleString("id-ID")}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total Kewajiban & Modal</span>
                        <span>Rp {financialData.totalAssets.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Laporan Laba Rugi</CardTitle>
                  <CardDescription>Periode {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pendapatan Usaha</span>
                      <span>Rp {financialData.pendapatanTahunIni.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Biaya Operasional</span>
                      <span>(Rp {financialData.biayaOperasional.toLocaleString("id-ID")})</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-green-600">
                      <span>Sisa Hasil Usaha (SHU)</span>
                      <span>Rp {financialData.shuTahunIni.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Analisis Kinerja</h4>
                    <div className="space-y-1 text-sm text-green-800">
                      <p>• ROA: {((financialData.shuTahunIni / financialData.totalAssets) * 100).toFixed(2)}%</p>
                      <p>
                        • Margin Keuntungan:{" "}
                        {((financialData.shuTahunIni / financialData.pendapatanTahunIni) * 100).toFixed(2)}%
                      </p>
                      <p>• Pertumbuhan: +15% dari tahun sebelumnya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shu-calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Algoritma Kalkulasi SHU
                </CardTitle>
                <CardDescription>Sistem otomatis perhitungan dan distribusi SHU</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Formula Jasa Simpanan</h4>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                      <p>SHU_Simpanan = (Simpanan_Anggota / Total_Simpanan) × Jasa_Simpanan</p>
                      <p className="mt-2 text-gray-600">Dimana Jasa_Simpanan = 40% × Total_SHU</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Formula Jasa Usaha</h4>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                      <p>SHU_Usaha = (Transaksi_Anggota / Total_Transaksi) × Jasa_Usaha</p>
                      <p className="mt-2 text-gray-600">Dimana Jasa_Usaha = 35% × Total_SHU</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Contoh Perhitungan (Ahmad Wijaya)</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Data Anggota:</strong>
                        </p>
                        <p>• Simpanan: Rp 2,900,000</p>
                        <p>• Transaksi: Rp 15,000,000</p>
                      </div>
                      <div>
                        <p>
                          <strong>Kalkulasi:</strong>
                        </p>
                        <p>• SHU Simpanan: (2,900,000 / 1,250,000,000) × 108,000,000 = Rp 251,520</p>
                        <p>• SHU Usaha: (15,000,000 / 300,000,000) × 94,500,000 = Rp 4,725,000</p>
                        <p className="font-bold text-blue-700">• Total SHU: Rp 4,976,520</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={calculateSHU} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Jalankan Kalkulasi Otomatis
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Simulasi Skenario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
