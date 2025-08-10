"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Users, Coins, TrendingUp, UserPlus, Search } from "lucide-react"
import Link from "next/link"

// Mock data
const membershipStats = {
  totalMembers: 247,
  activeMembers: 198,
  totalSimpanan: 1250000000,
  averageVotingPower: 35,
}

const members = [
  {
    id: "M001",
    name: "Ahmad Wijaya",
    joinDate: "2022-01-15",
    simpananPokok: 500000,
    simpananWajib: 2400000,
    totalSimpanan: 2900000,
    votingPower: 29,
    status: "active",
    lastActivity: "2024-01-15",
  },
  {
    id: "M002",
    name: "Siti Nurhaliza",
    joinDate: "2021-08-20",
    simpananPokok: 500000,
    simpananWajib: 4500000,
    totalSimpanan: 5000000,
    votingPower: 50,
    status: "active",
    lastActivity: "2024-01-14",
  },
  {
    id: "M003",
    name: "Budi Santoso",
    joinDate: "2020-03-10",
    simpananPokok: 500000,
    simpananWajib: 1800000,
    totalSimpanan: 2300000,
    votingPower: 23,
    status: "active",
    lastActivity: "2024-01-12",
  },
  {
    id: "M004",
    name: "Rina Dewi",
    joinDate: "2023-06-05",
    simpananPokok: 500000,
    simpananWajib: 600000,
    totalSimpanan: 1100000,
    votingPower: 11,
    status: "inactive",
    lastActivity: "2023-12-20",
  },
]

const pendingApplications = [
  {
    id: "A001",
    name: "Dewi Kartika",
    email: "dewi.kartika@email.com",
    phone: "081234567890",
    initialDeposit: 500000,
    applicationDate: "2024-01-10",
    status: "pending",
  },
  {
    id: "A002",
    name: "Joko Widodo",
    email: "joko.w@email.com",
    phone: "081987654321",
    initialDeposit: 750000,
    applicationDate: "2024-01-12",
    status: "pending",
  },
]

export default function MembershipManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    initialDeposit: "",
  })

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApproveApplication = (applicationId: string) => {
    alert(`Aplikasi ${applicationId} disetujui! Member baru akan mendapat voting tokens.`)
  }

  const handleRejectApplication = (applicationId: string) => {
    alert(`Aplikasi ${applicationId} ditolak.`)
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Member baru berhasil ditambahkan ke sistem DAO!")
    setNewMember({ name: "", email: "", phone: "", initialDeposit: "" })
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
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Keanggotaan</h1>
            <p className="text-gray-600">Kelola anggota dan tokenized membership</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membershipStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">{membershipStats.activeMembers} aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Simpanan</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(membershipStats.totalSimpanan / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Basis voting power</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Voting Power</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membershipStats.averageVotingPower}</div>
              <p className="text-xs text-muted-foreground">tokens per anggota</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aplikasi Pending</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
              <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Daftar Anggota</TabsTrigger>
            <TabsTrigger value="applications">Aplikasi Baru</TabsTrigger>
            <TabsTrigger value="add-member">Tambah Anggota</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Daftar Anggota Koperasi</CardTitle>
                    <CardDescription>Kelola anggota dan voting power mereka</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari anggota..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Bergabung</TableHead>
                      <TableHead>Simpanan Pokok</TableHead>
                      <TableHead>Simpanan Wajib</TableHead>
                      <TableHead>Total Simpanan</TableHead>
                      <TableHead>Voting Power</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktivitas Terakhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{new Date(member.joinDate).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>Rp {member.simpananPokok.toLocaleString("id-ID")}</TableCell>
                        <TableCell>Rp {member.simpananWajib.toLocaleString("id-ID")}</TableCell>
                        <TableCell>Rp {member.totalSimpanan.toLocaleString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.votingPower} tokens</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(member.lastActivity).toLocaleDateString("id-ID")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aplikasi Keanggotaan Baru</CardTitle>
                <CardDescription>Review dan setujui aplikasi anggota baru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{application.name}</h4>
                          <p className="text-sm text-gray-600">ID Aplikasi: {application.id}</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email</Label>
                          <p>{application.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Telepon</Label>
                          <p>{application.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Simpanan Awal</Label>
                          <p className="font-medium">Rp {application.initialDeposit.toLocaleString("id-ID")}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Tanggal Aplikasi</Label>
                          <p>{new Date(application.applicationDate).toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Setujui
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectApplication(application.id)}>
                          Tolak
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-member" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Anggota Baru</CardTitle>
                <CardDescription>Daftarkan anggota baru langsung ke sistem DAO</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        placeholder="081234567890"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="initialDeposit">Simpanan Awal (Rp) *</Label>
                      <Input
                        id="initialDeposit"
                        type="number"
                        value={newMember.initialDeposit}
                        onChange={(e) => setNewMember({ ...newMember, initialDeposit: e.target.value })}
                        placeholder="500000"
                        min="500000"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Minimum Rp 500,000 (simpanan pokok)</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informasi Voting Power</h4>
                    <p className="text-blue-800 text-sm">
                      Voting power akan dihitung berdasarkan total simpanan. Setiap Rp 100,000 simpanan = 1 voting
                      token.
                      {newMember.initialDeposit && (
                        <span className="font-medium">
                          {" "}
                          Voting power awal: {Math.floor(Number.parseInt(newMember.initialDeposit) / 100000)} tokens
                        </span>
                      )}
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Anggota Baru
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
