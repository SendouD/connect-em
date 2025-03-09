"use client"

import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

// Define TypeScript interface based on your Proposal schema
interface Proposal {
  _id: string;
  email: string;
  domain: string;
  type: string;
  amount: number;
  formId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

function Page() {
  const { isAuthenticated, authLoading, user } = useAuth()
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProposals()
    }
  }, [isAuthenticated, authLoading])

  const fetchUserProposals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/user-submitted-forms`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch proposals')
      }

      const data = await response.json()

      setProposals(data.proposals)
      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching proposals:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleViewDetails = (proposalId: string, formId: string) => {
    console.log(proposalId, formId);
    router.push(`/proposal/${proposalId}/${formId}`)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Submitted Applications</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchUserProposals}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500 mb-4">You haven't submitted any proposals yet</p>
            <Button onClick={() => router.push('/investor-proposals')}>
              Submit a New Proposal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal) => (
                <Card key={proposal._id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{proposal.domain}</CardTitle>
                    <CardDescription>Type: {proposal.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Amount:</span>
                        <span className="font-semibold">{formatCurrency(proposal.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Visibility:</span>
                        <Badge variant={proposal.isPublic ? "success" : "secondary"}>
                          {proposal.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                      
                      {proposal.createdAt && (
                        <p className="text-sm text-gray-500 pt-2">
                          Submitted: {format(new Date(proposal.createdAt), 'PPP')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewDetails(proposal._id, proposal.formId)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal) => ( 
                
                <Card key={proposal._id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{proposal.domain}</CardTitle>
                    <CardDescription>Type: {proposal.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Amount:</span>
                        <span className="font-semibold">{formatCurrency(proposal.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Visibility:</span>
                        <Badge variant={proposal.isPublic ? "success" : "secondary"}>
                          {proposal.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                      {proposal.createdAt && (
                        <p className="text-sm text-gray-500 pt-2">
                          Submitted: {format(new Date(proposal.createdAt), 'PPP')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() =>{ 
                        handleViewDetails(proposal._id, proposal.formId)}}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
)  )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default Page