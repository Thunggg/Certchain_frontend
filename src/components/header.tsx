"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown } from "lucide-react"

export function Header() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <header className="h-16 border-b border-border">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground font-display">Blockchain Certificate System</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">Secure, verifiable, decentralized</p>
          </div>
        </div>

        {/* Right side */}
        <appkit-button />
      </div>
    </header>
  )
}
