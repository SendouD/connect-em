"use client"

import FormBuilder from '@/components/form'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

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
        <FormBuilder />
    </div>
  )
}

export default page