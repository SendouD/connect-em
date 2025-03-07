"use client"

import ProposalFormBuilder from '@/components/proposal-form'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
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