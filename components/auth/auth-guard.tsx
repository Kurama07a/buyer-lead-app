"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  console.log("AuthGuard: user =", user, "loading =", loading)

  useEffect(() => {
    console.log("AuthGuard useEffect: user =", user, "loading =", loading)
    if (!loading && !user) {
      console.log("Redirecting to /login")
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    console.log("AuthGuard: showing loading")
    return <div>Loading...</div>
  }

  if (!user) {
    console.log("AuthGuard: no user, returning null")
    return null
  }

  console.log("AuthGuard: rendering children")
  return <>{children}</>
}