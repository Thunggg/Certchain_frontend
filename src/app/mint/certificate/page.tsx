"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MintCertificatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Mint Certificate</h1>
          <p className="text-sm text-muted-foreground">
            Create a new blockchain certificate (SBT)
          </p>
        </div>

        {/* form */}
        <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            Upload Certificate File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10 glow-border"
                : "border-border hover:border-primary/50"
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-12 w-12 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload">
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
              <Label htmlFor="cert-name" className="text-foreground">
                Certificate Name
              </Label>
              <Input
                id="cert-name"
                placeholder="e.g., Graduation Certificate 2025"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-foreground">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                className="bg-input border-border text-foreground font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Add details about this certificate..."
                className="bg-input border-border text-foreground min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuer" className="text-foreground">
                  Issuer Name
                </Label>
                <Input
                  id="issuer"
                  placeholder="Organization name"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-date" className="text-foreground">
                  Issue Date
                </Label>
                <Input
                  id="issue-date"
                  type="date"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground glow-border-subtle">
              Mint Certificate
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
