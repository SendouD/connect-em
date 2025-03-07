"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  username: string
  userId: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split("; ")
    const jwtCookie = cookies.find((row) => row.startsWith("jwt="))

    if (jwtCookie) {
      const token = jwtCookie.split("=")[1]
      try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const decodedPayload = JSON.parse(atob(base64))

        setUser({
          username: decodedPayload.username,
          userId: decodedPayload.userId,
          email: decodedPayload.email,
        })
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error decoding JWT:", error)
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)