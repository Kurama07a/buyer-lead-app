"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"

interface SearchFilters {
  search: string
  status: string
  priority: string
  propertyType: string
  propertyCondition: string
  leadSource: string
  estimatedValueMin: string
  estimatedValueMax: string
  createdDateFrom: string
  createdDateTo: string
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
  initialFilters?: Partial<SearchFilters>
}

export function AdvancedSearch({ onSearch, onClear, initialFilters = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    status: "",
    priority: "",
    propertyType: "",
    propertyCondition: "",
    leadSource: "",
    estimatedValueMin: "",
    estimatedValueMax: "",
    createdDateFrom: "",
    createdDateTo: "",
    ...initialFilters,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      search: "",
      status: "",
      priority: "",
      propertyType: "",
      propertyCondition: "",
      leadSource: "",
      estimatedValueMin: "",
      estimatedValueMax: "",
      createdDateFrom: "",
      createdDateTo: "",
    }
    setFilters(clearedFilters)
    onClear()
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const getActiveFiltersBadges = () => {
    const badges = []
    if (filters.search) badges.push({ label: `Search: ${filters.search}`, key: "search" })
    if (filters.status) badges.push({ label: `Status: ${filters.status}`, key: "status" })
    if (filters.priority) badges.push({ label: `Priority: ${filters.priority}`, key: "priority" })
    if (filters.propertyType) badges.push({ label: `Type: ${filters.propertyType}`, key: "propertyType" })
    if (filters.propertyCondition)
      badges.push({ label: `Condition: ${filters.propertyCondition}`, key: "propertyCondition" })
    if (filters.leadSource) badges.push({ label: `Source: ${filters.leadSource}`, key: "leadSource" })
    if (filters.estimatedValueMin)
      badges.push({ label: `Min Value: $${filters.estimatedValueMin}`, key: "estimatedValueMin" })
    if (filters.estimatedValueMax)
      badges.push({ label: `Max Value: $${filters.estimatedValueMax}`, key: "estimatedValueMax" })
    if (filters.createdDateFrom) badges.push({ label: `From: ${filters.createdDateFrom}`, key: "createdDateFrom" })
    if (filters.createdDateTo) badges.push({ label: `To: ${filters.createdDateTo}`, key: "createdDateTo" })
    return badges
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter Leads
        </CardTitle>
        <CardDescription>Find leads using various search criteria and filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or property address..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
          <Button onClick={handleSearch}>Search</Button>
          {getActiveFiltersCount() > 0 && (
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {getActiveFiltersBadges().length > 0 && (
          <div className="flex flex-wrap gap-2">
            {getActiveFiltersBadges().map((badge) => (
              <Badge key={badge.key} variant="secondary" className="flex items-center gap-1">
                {badge.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(badge.key as keyof SearchFilters, "")}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Status</SelectItem>
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
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Type</SelectItem>
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
              <Label>Property Condition</Label>
              <Select
                value={filters.propertyCondition}
                onValueChange={(value) => handleFilterChange("propertyCondition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">Any Condition</SelectItem>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                  <SelectItem value="NEEDS_REPAIR">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead Source</Label>
              <Input
                placeholder="e.g., Website, Referral"
                value={filters.leadSource}
                onChange={(e) => handleFilterChange("leadSource", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Min Estimated Value ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.estimatedValueMin}
                onChange={(e) => handleFilterChange("estimatedValueMin", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Estimated Value ($)</Label>
              <Input
                type="number"
                placeholder="1000000"
                value={filters.estimatedValueMax}
                onChange={(e) => handleFilterChange("estimatedValueMax", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Created From</Label>
              <Input
                type="date"
                value={filters.createdDateFrom}
                onChange={(e) => handleFilterChange("createdDateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Created To</Label>
              <Input
                type="date"
                value={filters.createdDateTo}
                onChange={(e) => handleFilterChange("createdDateTo", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
