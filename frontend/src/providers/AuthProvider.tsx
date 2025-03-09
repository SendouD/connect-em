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
  authLoading: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  authLoading: true,
  setIsAuthenticated: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include", 
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData)
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authLoading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);