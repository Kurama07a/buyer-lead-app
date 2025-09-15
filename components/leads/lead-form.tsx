"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LeadFormProps {
  initialData?: any
  isEditing?: boolean
}

export function LeadForm({ initialData, isEditing = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    propertyType: initialData?.propertyType || "",
    propertyAddress: initialData?.propertyAddress || "",
    propertyCity: initialData?.propertyCity || "",
    propertyState: initialData?.propertyState || "",
    propertyZipCode: initialData?.propertyZipCode || "",
    estimatedValue: initialData?.estimatedValue || "",
    desiredTimeframe: initialData?.desiredTimeframe || "",
    motivationForSelling: initialData?.motivationForSelling || "",
    currentMortgageBalance: initialData?.currentMortgageBalance || "",
    propertyCondition: initialData?.propertyCondition || "",
    additionalNotes: initialData?.additionalNotes || "",
    leadSource: initialData?.leadSource || "",
    status: initialData?.status || "NEW",
    priority: initialData?.priority || "MEDIUM",
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = isEditing ? `/api/leads/${initialData.id}` : "/api/leads"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estimatedValue: formData.estimatedValue ? Number.parseFloat(formData.estimatedValue) : null,
          currentMortgageBalance: formData.currentMortgageBalance
            ? Number.parseFloat(formData.currentMortgageBalance)
            : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Lead ${isEditing ? "updated" : "created"} successfully`,
        })
        router.push("/dashboard/leads")
      } else {
        throw new Error("Failed to save lead")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} lead`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Basic contact details for the lead</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>Details about the property they want to sell</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(value) => handleChange("propertyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_FAMILY">Single Family</SelectItem>
                <SelectItem value="MULTI_FAMILY">Multi Family</SelectItem>
                <SelectItem value="CONDO">Condo</SelectItem>
                <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                <SelectItem value="LAND">Land</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyCondition">Property Condition</Label>
            <Select
              value={formData.propertyCondition}
              onValueChange={(value) => handleChange("propertyCondition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="FAIR">Fair</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
                <SelectItem value="NEEDS_REPAIR">Needs Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="propertyAddress">Property Address *</Label>
            <Input
              id="propertyAddress"
              value={formData.propertyAddress}
              onChange={(e) => handleChange("propertyAddress", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyCity">Property City *</Label>
            <Input
              id="propertyCity"
              value={formData.propertyCity}
              onChange={(e) => handleChange("propertyCity", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyState">Property State *</Label>
            <Input
              id="propertyState"
              value={formData.propertyState}
              onChange={(e) => handleChange("propertyState", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyZipCode">Property ZIP Code *</Label>
            <Input
              id="propertyZipCode"
              value={formData.propertyZipCode}
              onChange={(e) => handleChange("propertyZipCode", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
            <Input
              id="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => handleChange("estimatedValue", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentMortgageBalance">Current Mortgage Balance ($)</Label>
            <Input
              id="currentMortgageBalance"
              type="number"
              value={formData.currentMortgageBalance}
              onChange={(e) => handleChange("currentMortgageBalance", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
          <CardDescription>Lead management and additional information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="desiredTimeframe">Desired Timeframe</Label>
            <Input
              id="desiredTimeframe"
              value={formData.desiredTimeframe}
              onChange={(e) => handleChange("desiredTimeframe", e.target.value)}
              placeholder="e.g., 3-6 months, ASAP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadSource">Lead Source</Label>
            <Input
              id="leadSource"
              value={formData.leadSource}
              onChange={(e) => handleChange("leadSource", e.target.value)}
              placeholder="e.g., Website, Referral, Cold Call"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
                <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                <SelectItem value="UNDER_CONTRACT">Under Contract</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="motivationForSelling">Motivation for Selling</Label>
            <Textarea
              id="motivationForSelling"
              value={formData.motivationForSelling}
              onChange={(e) => handleChange("motivationForSelling", e.target.value)}
              placeholder="Why are they looking to sell?"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              placeholder="Any additional information or notes"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Lead" : "Create Lead"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
