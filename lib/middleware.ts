import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const user = verifyToken(token)
      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      return handler(req, user)
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function requireAdmin(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withAuth(async (req: NextRequest, user: any) => {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    return handler(req, user)
  })
}
