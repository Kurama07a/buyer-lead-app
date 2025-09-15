"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResultsProps {
  results: {
    leads: any[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
    statistics: {
      total: number
      averageValue: number | null
      totalValue: number | null
      minValue: number | null
      maxValue: number | null
      statusBreakdown: Record<string, number>
      priorityBreakdown: Record<string, number>
    }
  }
  onPageChange: (page: number) => void
  onDelete: (id: string) => void
}

export function SearchResults({ results, onPageChange, onDelete }: SearchResultsProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      NEW: "default",
      CONTACTED: "secondary",
      QUALIFIED: "outline",
      PROPOSAL_SENT: "outline",
      NEGOTIATING: "outline",
      UNDER_CONTRACT: "outline",
      CLOSED: "default",
      LOST: "destructive",
      ARCHIVED: "secondary",
    }

    return <Badge variant={variants[status] || "default"}>{status.replace("_", " ")}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      LOW: "secondary",
      MEDIUM: "outline",
      HIGH: "default",
      URGENT: "destructive",
    }

    return <Badge variant={variants[priority] || "outline"}>{priority}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.statistics.total}</div>
            <p className="text-xs text-muted-foreground">leads found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.statistics.averageValue
                ? `$${Math.round(results.statistics.averageValue).toLocaleString()}`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">estimated property value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.statistics.totalValue ? `$${results.statistics.totalValue.toLocaleString()}` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">combined estimated value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Range</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.statistics.minValue && results.statistics.maxValue
                ? `$${results.statistics.minValue.toLocaleString()} - $${results.statistics.maxValue.toLocaleString()}`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">min - max values</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(results.statistics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{getStatusBadge(status)}</div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(results.statistics.priorityBreakdown).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{getPriorityBadge(priority)}</div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            Showing {results.leads.length} of {results.pagination.total} results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">by {lead.createdBy.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{lead.email}</div>
                      {lead.phone && <div className="text-sm text-muted-foreground">{lead.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{lead.propertyType.replace("_", " ")}</div>
                      <div className="text-sm text-muted-foreground">{lead.propertyAddress}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                  <TableCell>{lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : "-"}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/leads/${lead.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/leads/${lead.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(lead.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {results.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={results.pagination.page === 1}
                onClick={() => onPageChange(results.pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {results.pagination.page} of {results.pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={results.pagination.page === results.pagination.pages}
                onClick={() => onPageChange(results.pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
