"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, X } from "lucide-react"

export default function MintCreative() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Mint Creative Asset</h1>
          <p className="text-sm text-muted-foreground">Create a new rentable NFT (ERC-4907)</p>
        </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Upload Creative Asset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging ? "border-primary bg-primary/10 glow-border" : "border-border hover:border-primary/50"
            }`}
          >
            {preview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-64 rounded-lg border border-border"
                  />
                  <Button variant="destructive" size="icon" className="absolute -top-2 -right-2" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{file?.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground font-medium">Drag and drop your image here</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="creative-upload"
                  accept="image/*"
                />
                <label htmlFor="creative-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Metadata Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nft-name" className="text-foreground">
                NFT Name
              </Label>
              <Input
                id="nft-name"
                placeholder="e.g., Digital Artwork #1"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="nft-description"
                placeholder="Describe your creative asset..."
                className="bg-input border-border text-foreground min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="royalty" className="text-foreground">
                  Royalty (%)
                </Label>
                <Input
                  id="royalty"
                  type="number"
                  placeholder="5"
                  min="0"
                  max="100"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rental-price" className="text-foreground">
                  Rental Price (ETH)
                </Label>
                <Input
                  id="rental-price"
                  type="number"
                  placeholder="0.01"
                  step="0.001"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="properties" className="text-foreground">
                Properties (Optional)
              </Label>
              <Input
                id="properties"
                placeholder="e.g., Artist: John Doe, Year: 2025"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground glow-border-subtle">Mint Creative NFT</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
