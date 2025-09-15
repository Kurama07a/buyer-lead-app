import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    // Get counts for different lead statuses
    const [totalLeads, newLeads, qualifiedLeads, closedLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "QUALIFIED" } }),
      prisma.lead.count({ where: { status: "CLOSED" } }),
    ])

    return NextResponse.json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      closedLeads,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
})