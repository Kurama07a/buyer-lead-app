"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { SearchResults } from "@/components/search/search-results"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<any>({})
  const { toast } = useToast()

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Search" }]

  const handleSearch = async (filters: any, page = 1) => {
    setLoading(true)
    setCurrentFilters(filters)
    setCurrentPage(page)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      // Add all non-empty filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value as string)
        }
      })

      const response = await fetch(`/api/leads/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        throw new Error("Search failed")
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search leads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setResults(null)
    setCurrentFilters({})
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    handleSearch(currentFilters, page)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lead deleted successfully",
        })
        // Refresh search results
        handleSearch(currentFilters, currentPage)
      } else {
        throw new Error("Failed to delete lead")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Leads</h1>
          <p className="text-muted-foreground">Find leads using advanced search and filtering options</p>
        </div>

        <AdvancedSearch onSearch={handleSearch} onClear={handleClear} initialFilters={currentFilters} />

        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Searching leads...</div>
          </div>
        )}

        {results && !loading && (
          <SearchResults results={results} onPageChange={handlePageChange} onDelete={handleDelete} />
        )}

        {!results && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg mb-2">No search performed yet</div>
            <div>Use the search form above to find leads</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
