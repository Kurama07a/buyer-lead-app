import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name?: string): Promise<AuthUser | null> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("User already exists")
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("User creation error:", error)
    return null
  }
}

export async function getServerUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | null = null

    if (request) {
      
      token = request.cookies.get("auth-token")?.value ?? request.headers.get("authorization")?.replace("Bearer ", "") ?? null
    } else {
    
      return null
    }

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}