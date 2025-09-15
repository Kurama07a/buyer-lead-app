import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Search and filter parameters
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const propertyType = searchParams.get("propertyType")
    const propertyCondition = searchParams.get("propertyCondition")
    const leadSource = searchParams.get("leadSource")
    const estimatedValueMin = searchParams.get("estimatedValueMin")
    const estimatedValueMax = searchParams.get("estimatedValueMax")
    const createdDateFrom = searchParams.get("createdDateFrom")
    const createdDateTo = searchParams.get("createdDateTo")

    const skip = (page - 1) * limit
    const where: any = {}

    // Text search across multiple fields
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { propertyAddress: { contains: search, mode: "insensitive" } },
        { propertyCity: { contains: search, mode: "insensitive" } },
        { motivationForSelling: { contains: search, mode: "insensitive" } },
        { additionalNotes: { contains: search, mode: "insensitive" } },
      ]
    }

    // Status filter
    if (status) {
      where.status = status
    }

    // Priority filter
    if (priority) {
      where.priority = priority
    }

    // Property type filter
    if (propertyType) {
      where.propertyType = propertyType
    }

    // Property condition filter
    if (propertyCondition) {
      where.propertyCondition = propertyCondition
    }

    // Lead source filter
    if (leadSource) {
      where.leadSource = { contains: leadSource, mode: "insensitive" }
    }

    // Estimated value range filter
    if (estimatedValueMin || estimatedValueMax) {
      where.estimatedValue = {}
      if (estimatedValueMin) {
        where.estimatedValue.gte = Number.parseFloat(estimatedValueMin)
      }
      if (estimatedValueMax) {
        where.estimatedValue.lte = Number.parseFloat(estimatedValueMax)
      }
    }

    // Date range filter
    if (createdDateFrom || createdDateTo) {
      where.createdAt = {}
      if (createdDateFrom) {
        where.createdAt.gte = new Date(createdDateFrom)
      }
      if (createdDateTo) {
        const toDate = new Date(createdDateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        where.createdAt.lte = toDate
      }
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          updatedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    // Get aggregated statistics for the search results
    const stats = await prisma.lead.aggregate({
      where,
      _count: { id: true },
      _avg: { estimatedValue: true },
      _sum: { estimatedValue: true },
      _min: { estimatedValue: true },
      _max: { estimatedValue: true },
    })

    // Get status breakdown
    const statusBreakdown = await prisma.lead.groupBy({
      by: ["status"],
      where,
      _count: { status: true },
    })

    // Get priority breakdown
    const priorityBreakdown = await prisma.lead.groupBy({
      by: ["priority"],
      where,
      _count: { priority: true },
    })

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: {
        total: stats._count.id,
        averageValue: stats._avg.estimatedValue,
        totalValue: stats._sum.estimatedValue,
        minValue: stats._min.estimatedValue,
        maxValue: stats._max.estimatedValue,
        statusBreakdown: statusBreakdown.reduce(
          (acc, item) => {
            acc[item.status] = item._count.status
            return acc
          },
          {} as Record<string, number>,
        ),
        priorityBreakdown: priorityBreakdown.reduce(
          (acc, item) => {
            acc[item.priority] = item._count.priority
            return acc
          },
          {} as Record<string, number>,
        ),
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search leads" }, { status: 500 })
  }
})
