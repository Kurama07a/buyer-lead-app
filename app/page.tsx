"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FileSpreadsheet, Search } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Buyer Lead Intake System</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your real estate lead management with our comprehensive platform. Track prospects, manage
            property interests, and grow your business efficiently.
          </p>
          <Button size="lg" onClick={() => router.push("/login")} className="text-lg px-8 py-3">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Capture and organize buyer information with detailed profiles and contact history.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Property Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track property interests, preferences, and match buyers with suitable listings.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>CSV Import/Export</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily import existing leads and export data for analysis and reporting.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Find leads quickly with powerful search and filtering capabilities.</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Demo Credentials</CardTitle>
              <CardDescription>Use these credentials to explore the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Email:</strong> demo@example.com
              </div>
              <div className="text-sm">
                <strong>Password:</strong> demo123
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
