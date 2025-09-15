"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImportCSV() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/leads/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast({
          title: "Import successful",
          description: data.message,
        })
      } else {
        throw new Error(data.error || "Import failed")
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = `First Name,Last Name,Email,Phone,Address,City,State,ZIP Code,Property Type,Property Address,Property City,Property State,Property ZIP Code,Estimated Value,Desired Timeframe,Motivation for Selling,Current Mortgage Balance,Property Condition,Additional Notes,Lead Source,Status,Priority
John,Smith,john.smith@email.com,(555) 123-4567,123 Main St,Anytown,CA,90210,SINGLE_FAMILY,456 Oak Avenue,Anytown,CA,90210,450000,3-6 months,Relocating for work,280000,GOOD,Motivated seller,Website Form,NEW,HIGH
Sarah,Johnson,sarah.johnson@email.com,(555) 987-6543,789 Pine St,Springfield,TX,75001,CONDO,321 Elm Street Unit 5B,Springfield,TX,75001,275000,6-12 months,Downsizing,150000,EXCELLENT,Recently renovated,Referral,NEW,MEDIUM`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads-import-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Leads from CSV</CardTitle>
          <CardDescription>Upload a CSV file to bulk import leads into the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={importing} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={!file || importing} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {importing ? "Importing..." : "Import CSV"}
            </Button>

            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {importing && (
            <div className="space-y-2">
              <Progress value={50} className="w-full" />
              <p className="text-sm text-muted-foreground">Processing CSV file...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.errors > 0 ? (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.imported}</div>
                <div className="text-sm text-green-700">Successfully Imported</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.errors}</div>
                <div className="text-sm text-red-700">Errors</div>
              </div>
            </div>

            {result.errorDetails && result.errorDetails.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Import Errors:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.errorDetails.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Required Fields:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>First Name, Last Name, Email</li>
              <li>Property Type, Property Address, Property City, Property State, Property ZIP Code</li>
            </ul>

            <p className="mt-4">
              <strong>Property Types:</strong>
            </p>
            <p className="ml-4">SINGLE_FAMILY, MULTI_FAMILY, CONDO, TOWNHOUSE, LAND, COMMERCIAL, OTHER</p>

            <p className="mt-4">
              <strong>Property Conditions:</strong>
            </p>
            <p className="ml-4">EXCELLENT, GOOD, FAIR, POOR, NEEDS_REPAIR</p>

            <p className="mt-4">
              <strong>Status Options:</strong>
            </p>
            <p className="ml-4">
              NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATING, UNDER_CONTRACT, CLOSED, LOST, ARCHIVED
            </p>

            <p className="mt-4">
              <strong>Priority Levels:</strong>
            </p>
            <p className="ml-4">LOW, MEDIUM, HIGH, URGENT</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
