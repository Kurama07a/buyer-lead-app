import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
        history: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const data = await req.json()
    const { id } = params

    // Get current lead for history tracking
    const currentLead = await prisma.lead.findUnique({
      where: { id },
    })

    if (!currentLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        updatedById: user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        updatedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Create history entries for changed fields
    const changedFields = Object.keys(data).filter((key) => currentLead[key as keyof typeof currentLead] !== data[key])

    for (const field of changedFields) {
      await prisma.leadHistory.create({
        data: {
          leadId: id,
          field,
          oldValue: String(currentLead[field as keyof typeof currentLead] || ""),
          newValue: String(data[field] || ""),
          action: field === "status" ? "STATUS_CHANGED" : "UPDATED",
          userId: user.id,
        },
      })
    }

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    await prisma.lead.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
})
