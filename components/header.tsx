"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="font-bold text-lg">Certichain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              About
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Overview
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Community
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            LOGIN
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Sign Up
          </Button>
          <button className="p-2 hover:bg-card rounded-lg transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
