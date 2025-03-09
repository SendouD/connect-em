"use client"

import FormBuilder from '@/components/form'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import React from 'react'

function page() {

  return (
    <div>
      <ProtectedRoute>
        <FormBuilder />
      </ProtectedRoute>
    </div>
  )
}

export default page