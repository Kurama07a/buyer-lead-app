import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ExportCSV } from "@/components/csv/export-csv"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ExportPage() {
  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Export Data" }]

  return (
    <AuthGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Export Leads</h1>
            <p className="text-muted-foreground">Download your leads data as CSV files</p>
          </div>

          <ExportCSV />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
