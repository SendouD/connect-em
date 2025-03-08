"use client"

import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


function page() {
    const { isAuthenticated, authLoading } = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
        router.push("/auth")
        }
    }, [isAuthenticated, router])

    return (
        <div>
            
        </div>
    )
}

export default page