"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "./countdown-timer"

interface PriceSectionProps {
  price: number
  priceUsd: number
  onAddToCart: () => void
  onMakeOffer: () => void
}

export function PriceSection({ price, priceUsd, onAddToCart, onMakeOffer }: PriceSectionProps) {
  return (
    <div className="space-y-6 bg-card rounded-xl p-6 border border-border">
      <CountdownTimer endTime={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)} />

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Current Price</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{price} ETH</span>
          <span className="text-muted-foreground">${priceUsd.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onAddToCart} className="flex-1 bg-secondary hover:bg-secondary/90">
          ADD TO CART
        </Button>
        <Button onClick={onMakeOffer} variant="outline" className="flex-1 bg-transparent">
          MAKE OFFER
        </Button>
      </div>
    </div>
  )
}
