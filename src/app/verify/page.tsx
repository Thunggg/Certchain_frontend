"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type VerificationStatus = "idle" | "verifying" | "verified" | "invalid"

export default function VerifyCertificate() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<VerificationStatus>("idle")
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
    if (droppedFile) {
      setFile(droppedFile)
      setStatus("idle")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
    }
  }

  const handleVerify = () => {
    setStatus("verifying")
    // Simulate verification
    setTimeout(() => {
      setStatus(Math.random() > 0.3 ? "verified" : "invalid")
    }, 2000)
  }

  return (
    <div className="px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Verify Certificate</h1>
          <p className="text-sm text-muted-foreground">Upload a file to verify its authenticity on the blockchain</p>
        </div>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Upload File for Verification</CardTitle>
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
            {file ? (
              <div className="space-y-4">
                <FileText className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                </div>
                <input type="file" onChange={handleFileChange} className="hidden" id="verify-upload" />
                <label htmlFor="verify-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Verify Button */}
          {file && status === "idle" && (
            <Button onClick={handleVerify} className="w-full bg-primary text-primary-foreground glow-border-subtle">
              Verify Certificate
            </Button>
          )}

          {/* Verification Status */}
          {status === "verifying" && (
            <Alert className="border-primary bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">Verifying certificate on blockchain...</AlertDescription>
            </Alert>
          )}

          {status === "verified" && (
            <Alert className="border-primary bg-primary/10 glow-border-subtle">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                <div className="space-y-2">
                  <p className="font-semibold">Certificate Verified ✓</p>
                  <div className="text-sm space-y-1">
                    <p>Token ID: #1234</p>
                    <p>Issuer: University of Technology</p>
                    <p>Issue Date: January 10, 2025</p>
                    <p className="font-mono text-xs">Hash: 0xabcd1234...5678efgh</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === "invalid" && (
            <Alert className="border-destructive bg-destructive/10">
              <XCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-foreground">
                <p className="font-semibold">Certificate Not Found</p>
                <p className="text-sm mt-1">
                  This file could not be verified on the blockchain. It may have been modified or is not a registered
                  certificate.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {status !== "idle" && (
            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setStatus("idle")
              }}
              className="w-full"
            >
              Verify Another File
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">How Verification Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Upload the certificate file you want to verify</p>
          <p>2. The system generates a cryptographic hash of your file</p>
          <p>3. The hash is compared against records on the blockchain</p>
          <p>4. If a match is found, the certificate details are displayed</p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
