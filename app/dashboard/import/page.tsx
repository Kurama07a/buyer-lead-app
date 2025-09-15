import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ImportCSV } from "@/components/csv/import-csv"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ImportPage() {
  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Import CSV" }]

  return (
    <AuthGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Leads</h1>
            <p className="text-muted-foreground">Bulk import leads from CSV files</p>
          </div>

          <ImportCSV />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
