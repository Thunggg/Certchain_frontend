"use client";

import { NFTCard } from "./nft-card";

interface NFTGridProps {
  items: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
    creator: string;
  }>;
}

export function NFTGrid({ items }: NFTGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <NFTCard key={item.id} {...item} />
      ))}
    </div>
  );
}
