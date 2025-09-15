"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log("checkAuth: starting")
    try {
      const token = localStorage.getItem("auth-token")
      console.log("checkAuth: token =", token ? "exists" : "null")
      if (!token) {
        console.log("checkAuth: no token, setting loading false")
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      console.log("checkAuth: /api/auth/me response status =", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("checkAuth: user data =", data.user)
        setUser(data.user)
      } else {
        console.log("checkAuth: response not ok, removing token")
        localStorage.removeItem("auth-token")
      }
    } catch (error) {
      console.log("checkAuth: error =", error)
      localStorage.removeItem("auth-token")
    } finally {
      console.log("checkAuth: setting loading false")
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("login: starting with email =", email)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      console.log("login: response status =", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("login: data =", data)
        setUser(data.user)
        // Store token in localStorage
        localStorage.setItem("auth-token", data.token)
        console.log("login: user set and token stored")
        return true
      }
      console.log("login: response not ok")
      return false
    } catch (error) {
      console.log("login: error =", error)
      return false
    }
  }

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      localStorage.removeItem("auth-token")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
