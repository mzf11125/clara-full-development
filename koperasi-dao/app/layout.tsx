import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "DAO KOPERASI - Democratic Governance Platform",
  description: "Blockchain-powered cooperative governance with tokenized membership and transparent decision making",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white neo-font">
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
