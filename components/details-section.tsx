"use client"

interface DetailItem {
  label: string
  value: string
}

interface DetailsSectionProps {
  description: string
  details: DetailItem[]
}

export function DetailsSection({ description, details }: DetailsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div>
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Details</h2>
        <div className="space-y-3">
          {details.map((detail, idx) => (
            <div key={idx} className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">{detail.label}</span>
              <span className="font-medium text-secondary">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
