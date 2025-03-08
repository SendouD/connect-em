"use client"

import ProposalFormBuilder from '@/components/proposal-form'
import { useAuth } from '@/providers/AuthProvider'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
    const { isAuthenticated, authLoading } = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
        router.push("/auth")
        }
    }, [isAuthenticated, router])
    let { formId, formName } = useParams();
    formId = formId?.toString();
    formName = formName?.toString();

    return (
        <div>
            <ProposalFormBuilder formId={formId} formName={formName} />
        </div>
    )
}

export default page