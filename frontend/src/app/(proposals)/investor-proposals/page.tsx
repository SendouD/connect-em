"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

interface Proposal {
  _id: string
  domain: string
  type: string
  amount: number
  formId: string
  isPublic: boolean
  email?: string
  title?: string
  description?: string
}

function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposal/get-all`)
        const data = await response.json()
        if (response.ok) {
          setProposals(data.proposals)
        } else {
          setError(data.message)
        }
      } catch (err) {
        console.error(err)
        setError("An error occurred while fetching proposals")
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const handleCardClick = (proposalId: string, formId: string) => {
    router.push(`/proposal/${proposalId}/${formId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Investor Proposals</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Grants</h1>
      {proposals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <div key={proposal._id} onClick={() => handleCardClick(proposal._id, proposal.formId)}>
              <Card className="h-full">
                <CardHeader className="">
                  <CardTitle className="text-lg truncate" title={proposal.title || "No title"}>
                    {proposal.title || "No title"}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 max-h-10" title={proposal.description || "No description"}>
                    {proposal.description || "No description"}
                  </CardDescription>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline">{proposal.domain}</Badge>
                    <Badge variant="outline">{proposal.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {proposal.email && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground truncate">
                        <Mail className="h-4 w-4" />
                        <span className="truncate" title={proposal.email}>{proposal.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="font-semibold">${proposal.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Form:</span>
                      <span>{"Yes"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Visibility:</span>
                      <Badge variant={proposal.isPublic ? "default" : "secondary"}>
                        {proposal.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Proposals Found</CardTitle>
            <CardDescription>There are currently no investment proposals to display.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

export default ProposalsPage