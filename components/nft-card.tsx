"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NFTCardProps {
  id: string
  title: string
  image: string
  price: number
  creator: string
}

export function NFTCard({ id, title, image, price, creator }: NFTCardProps) {
  return (
    <Link href={`/nft/${id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
        </div>
        <h3 className="font-semibold mb-1 group-hover:text-primary transition">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{creator}</p>
        <div className="flex items-center justify-between">
          <span className="text-secondary font-semibold">{price} ETH</span>
          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition bg-transparent">
            ADD TO CART
          </Button>
        </div>
      </div>
    </Link>
  )
}
