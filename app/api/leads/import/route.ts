import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { parseCSV } from "@/lib/csv-utils"

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 })
    }

    const csvText = await file.text()
    const leads = parseCSV(csvText)

    if (leads.length === 0) {
      return NextResponse.json({ error: "No valid leads found in CSV" }, { status: 400 })
    }

    // Import leads to database
    const importedLeads = []
    const errors = []

    for (const leadData of leads) {
      try {
        // Set defaults for required fields
        const lead = await prisma.lead.create({
          data: {
            ...leadData,
            status: leadData.status || "NEW",
            priority: leadData.priority || "MEDIUM",
            propertyType: leadData.propertyType.toUpperCase().replace(" ", "_"),
            propertyCondition: leadData.propertyCondition?.toUpperCase().replace(" ", "_"),
            createdById: user.id,
          },
        })

        // Create history entry
        await prisma.leadHistory.create({
          data: {
            leadId: lead.id,
            field: "status",
            newValue: lead.status,
            action: "CREATED",
            userId: user.id,
          },
        })

        importedLeads.push(lead)
      } catch (error) {
        console.error("Error importing lead:", error)
        errors.push(`Failed to import ${leadData.firstName} ${leadData.lastName}: ${leadData.email}`)
      }
    }

    return NextResponse.json({
      message: `Successfully imported ${importedLeads.length} leads`,
      imported: importedLeads.length,
      errors: errors.length,
      errorDetails: errors,
    })
  } catch (error) {
    console.error("CSV import error:", error)
    return NextResponse.json({ error: "Failed to import CSV" }, { status: 500 })
  }
})
