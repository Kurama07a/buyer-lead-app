"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"

interface Stats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  closedLeads: number
}

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    closedLeads: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activities"),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const breadcrumbs = [{ label: "Dashboard" }]

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout breadcrumbs={breadcrumbs}>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your buyer lead management system</p>
          </div>

          <StatsCards stats={stats} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest lead updates and activities</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.message}</p>
                        </div>
                        <div className="ml-auto font-medium text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No recent activities</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/leads/create"
                    className="block w-full p-3 text-left rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="font-medium">Create New Lead</div>
                    <div className="text-sm text-muted-foreground">Add a new buyer lead to the system</div>
                  </Link>
                  <Link
                    href="/dashboard/import"
                    className="block w-full p-3 text-left rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="font-medium">Import CSV</div>
                    <div className="text-sm text-muted-foreground">Bulk import leads from spreadsheet</div>
                  </Link>
                  <Link
                    href="/dashboard/leads"
                    className="block w-full p-3 text-left rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="font-medium">View All Leads</div>
                    <div className="text-sm text-muted-foreground">Browse and manage existing leads</div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
