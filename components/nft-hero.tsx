"use client"

interface NFTHeroProps {
  image: string
  title: string
  creator: string
  verified: boolean
}

export function NFTHero({ image, title, creator, verified }: NFTHeroProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="relative">
        <div className="aspect-square rounded-2xl overflow-hidden gradient-purple-cyan p-1">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-secondary">Zeno Docs</span>
            {verified && <span className="text-secondary">✓</span>}
          </div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">By {creator}</p>
        </div>
      </div>
    </div>
  )
}
