import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    // Get recent lead activities from history
    const activities = await prisma.leadHistory.findMany({
      take: 5,
      orderBy: { timestamp: "desc" },
      include: {
        lead: {
          select: {
            firstName: true,
            lastName: true,
            propertyAddress: true,
            propertyCity: true,
            propertyState: true,
          },
        },
      },
    })

    // Get user names for the activities
    const userIds = [...new Set(activities.map(a => a.userId))]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    })
    const userMap = new Map(users.map(u => [u.id, u.name]))

    // Format activities for display
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.action,
      message: getActivityMessage(activity, userMap.get(activity.userId) || "Unknown User"),
      timestamp: activity.timestamp,
    }))

    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error("Error fetching dashboard activities:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard activities" }, { status: 500 })
  }
})

function getActivityMessage(activity: any, userName: string): string {
  const lead = activity.lead
  const leadName = `${lead.firstName} ${lead.lastName}`
  const propertyLocation = `${lead.propertyAddress}, ${lead.propertyCity}, ${lead.propertyState}`

  switch (activity.action) {
    case "CREATED":
      return `New lead: ${leadName} - ${propertyLocation}`
    case "STATUS_CHANGED":
      return `Status updated: ${leadName} - Changed from ${activity.oldValue} to ${activity.newValue}`
    case "UPDATED":
      return `Lead updated: ${leadName} - ${activity.field} changed`
    case "ASSIGNED":
      return `Lead assigned: ${leadName} to ${userName}`
    case "NOTE_ADDED":
      return `Note added to ${leadName}`
    default:
      return `${activity.action}: ${leadName}`
  }
}