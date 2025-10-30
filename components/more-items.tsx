"use client";

import { ChevronRight } from "lucide-react";
import { NFTCard } from "./nft-card";

interface MoreItemsProps {
  items: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
    creator: string;
  }>;
}

export function MoreItems({ items }: MoreItemsProps) {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">More Items</h2>
        <button className="flex items-center gap-2 text-secondary hover:text-primary transition">
          VIEW COLLECTION <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <NFTCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
