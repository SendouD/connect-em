"use client"

import ProposalFormBuilder from '@/components/proposal-form'
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
    let { formId, formName } = useParams();
    formId = formId?.toString();
    formName = formName?.toString();

    return (
        <ProtectedRoute>
            <div>
                <ProposalFormBuilder formId={formId} formName={formName} />
            </div>
        </ProtectedRoute>
    )
}

export default page