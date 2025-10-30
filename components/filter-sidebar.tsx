"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FilterCategory {
  name: string
  count: number
}

export function FilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["tags"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const categories: FilterCategory[] = [
    { name: "All categories", count: 1250 },
    { name: "Category 1", count: 340 },
    { name: "Category 2", count: 280 },
    { name: "Category 3", count: 195 },
    { name: "Category 4", count: 150 },
    { name: "Category 5", count: 85 },
  ]

  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Filter Tags */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <button onClick={() => toggleSection("tags")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold">Filter Tags</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.includes("tags") ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.includes("tags") && (
          <div className="flex flex-wrap gap-2">
            {["All", "Trending", "New", "Featured"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary hover:bg-primary/30 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Form */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <button onClick={() => toggleSection("form")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold">Filter Form</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.includes("form") ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.includes("form") && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
            />
            <input
              type="number"
              placeholder="Min price"
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
            />
            <input
              type="number"
              placeholder="Max price"
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
            />
          </div>
        )}
      </div>

      {/* Filter Check */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <button onClick={() => toggleSection("check")} className="flex items-center justify-between w-full mb-4">
          <h3 className="font-semibold">Filter Check</h3>
          <ChevronDown className={`w-4 h-4 transition ${expandedSections.includes("check") ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.includes("check") && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
