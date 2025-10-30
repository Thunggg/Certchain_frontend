"use client";

import { FilterSidebar } from "@/components/filter-sidebar";
import { MarketplaceHeader } from "@/components/marketplace-header";
import { NFTGrid } from "@/components/nft-grid";
import { useState } from "react";

const mockNFTs = [
  {
    id: "1",
    title: "Lorem Ipsum dolor",
    image: "/blue-gradient-nft-art.jpg",
    price: 0.15,
    creator: "Creator 1",
  },
  {
    id: "2",
    title: "Lorem Ipsum dolor",
    image: "/pink-gradient-nft-art.jpg",
    price: 0.22,
    creator: "Creator 2",
  },
  {
    id: "3",
    title: "Lorem Ipsum dolor",
    image: "/orange-gradient-nft-art.jpg",
    price: 0.18,
    creator: "Creator 3",
  },
  {
    id: "4",
    title: "Lorem Ipsum dolor",
    image: "/purple-gradient-nft-art.jpg",
    price: 0.31,
    creator: "Creator 4",
  },
  {
    id: "5",
    title: "Lorem Ipsum dolor",
    image: "/cyan-gradient-nft-art.jpg",
    price: 0.25,
    creator: "Creator 5",
  },
  {
    id: "6",
    title: "Lorem Ipsum dolor",
    image: "/magenta-gradient-nft-art.jpg",
    price: 0.28,
    creator: "Creator 6",
  },
  {
    id: "7",
    title: "Lorem Ipsum dolor",
    image: "/yellow-gradient-nft-art.jpg",
    price: 0.19,
    creator: "Creator 7",
  },
  {
    id: "8",
    title: "Lorem Ipsum dolor",
    image: "/green-gradient-nft-art.jpg",
    price: 0.33,
    creator: "Creator 8",
  },
  {
    id: "9",
    title: "Lorem Ipsum dolor",
    image: "/red-gradient-nft-art.jpg",
    price: 0.21,
    creator: "Creator 9",
  },
];

export default function MarketplacePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-12">Marketplace</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterSidebar />
            </div>
            <div className="lg:col-span-3">
              <MarketplaceHeader onViewChange={setView} onSort={setSort} />
              <NFTGrid items={mockNFTs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
