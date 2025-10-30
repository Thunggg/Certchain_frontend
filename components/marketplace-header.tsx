"use client"

import { Search, Grid3x3, List } from "lucide-react"
import { useState } from "react"

interface MarketplaceHeaderProps {
  onViewChange: (view: "grid" | "list") => void
  onSort: (sort: string) => void
}

export function MarketplaceHeader({ onViewChange, onSort }: MarketplaceHeaderProps) {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items, collections, and accounts"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-card rounded-lg p-1 border border-border">
          <button
            onClick={() => {
              setView("grid")
              onViewChange("grid")
            }}
            className={`p-2 rounded transition ${view === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setView("list")
              onViewChange("list")
            }}
            className={`p-2 rounded transition ${view === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <select
          onChange={(e) => onSort(e.target.value)}
          className="px-4 py-2 rounded-lg bg-input border border-border text-sm"
        >
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
          <option>Most Popular</option>
        </select>
      </div>
      <div className="text-sm text-muted-foreground">Showing 125 results</div>
    </div>
  )
}
