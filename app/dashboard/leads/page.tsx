import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LeadsTable } from "@/components/leads/leads-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function LeadsPage() {
  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Leads" }]

  return (
    <AuthGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
              <p className="text-muted-foreground">Manage your buyer leads</p>
            </div>
            <Link href="/dashboard/leads/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Lead
              </Button>
            </Link>
          </div>

          <LeadsTable />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
