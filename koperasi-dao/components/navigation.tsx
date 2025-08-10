"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Zap, Users, Vote, DollarSign, CreditCard, Shield, Building } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: Zap, color: "yellow" },
  { href: "/proposals", label: "Proposals", icon: Building, color: "pink" },
  { href: "/voting", label: "Voting", icon: Vote, color: "cyan" },
  { href: "/profits", label: "Profits", icon: DollarSign, color: "green" },
  { href: "/loans", label: "Loans", icon: CreditCard, color: "orange" },
  { href: "/audit", label: "Audit", icon: Shield, color: "purple" },
  { href: "/strategic", label: "Strategic", icon: Users, color: "red" },
]

const colorClasses = {
  yellow: "bg-yellow-400 text-black",
  pink: "bg-pink-500 text-white",
  cyan: "bg-cyan-400 text-black",
  green: "bg-green-400 text-black",
  orange: "bg-orange-400 text-black",
  purple: "bg-purple-500 text-white",
  red: "bg-red-500 text-white",
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_#000000]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black border-4 border-black shadow-[4px_4px_0px_0px_#ffff00] flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">DAO KOPERASI</h1>
                <p className="text-sm font-bold mono">DEMOCRATIC GOVERNANCE</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 border-4 border-black font-bold uppercase text-sm shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150 ${
                      isActive
                        ? colorClasses[item.color as keyof typeof colorClasses]
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_#000000]">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-black border-4 border-black shadow-[3px_3px_0px_0px_#ffff00] flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-lg font-black uppercase tracking-tight">DAO KOPERASI</h1>
              </div>
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="neo-button p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-white border-t-4 border-black shadow-[0px_4px_0px_0px_#000000]">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 border-4 border-black font-bold uppercase text-sm shadow-[3px_3px_0px_0px_#000000] w-full ${
                      isActive ? colorClasses[item.color as keyof typeof colorClasses] : "bg-white text-black"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-20 md:h-20"></div>
    </>
  )
}
