import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  return NextResponse.json({ user })
})
