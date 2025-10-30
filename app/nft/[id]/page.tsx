"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NFTHero } from "@/components/nft-hero"
import { PriceSection } from "@/components/price-section"
import { DetailsSection } from "@/components/details-section"
import { MoreItems } from "@/components/more-items"

const mockNFT = {
  id: "1",
  title: "The Lorem Ipsum Dolor",
  creator: "Zeno Docs",
  verified: true,
  image: "/colorful-gradient-nft-art.jpg",
  price: 0.27,
  priceUsd: 450,
  description:
    "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  details: [
    { label: "Contract Address", value: "0x1234...5678" },
    { label: "Token ID", value: "12345" },
    { label: "Token Standard", value: "ERC-721" },
    { label: "Blockchain", value: "Ethereum" },
    { label: "Last Sold", value: "2 days ago" },
    { label: "Last Price", value: "0.25 ETH" },
  ],
}

const moreItems = [
  { id: "2", title: "Lorem Ipsum dolor", image: "/blue-gradient-nft.jpg", price: 0.15, creator: "Creator 1" },
  { id: "3", title: "Lorem Ipsum dolor", image: "/pink-gradient-nft.jpg", price: 0.22, creator: "Creator 2" },
  { id: "4", title: "Lorem Ipsum dolor", image: "/orange-gradient-nft.jpg", price: 0.18, creator: "Creator 3" },
  { id: "5", title: "Lorem Ipsum dolor", image: "/purple-gradient-nft.jpg", price: 0.31, creator: "Creator 4" },
]

export default function NFTDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NFTHero
                image={mockNFT.image}
                title={mockNFT.title}
                creator={mockNFT.creator}
                verified={mockNFT.verified}
              />
              <DetailsSection description={mockNFT.description} details={mockNFT.details} />
            </div>
            <div>
              <PriceSection
                price={mockNFT.price}
                priceUsd={mockNFT.priceUsd}
                onAddToCart={() => console.log("Added to cart")}
                onMakeOffer={() => console.log("Make offer")}
              />
            </div>
          </div>
          <MoreItems items={moreItems} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
