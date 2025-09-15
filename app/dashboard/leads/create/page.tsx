import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LeadForm } from "@/components/leads/lead-form"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function CreateLeadPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leads", href: "/dashboard/leads" },
    { label: "Create Lead" },
  ]

  return (
    <AuthGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Lead</h1>
            <p className="text-muted-foreground">Add a new buyer lead to the system</p>
          </div>

          <LeadForm />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
