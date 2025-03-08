"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from '@/components/ui/card'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, ChevronLeft, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/providers/AuthProvider'

export default function InvestorDashboard() {
    const [proposals, setProposals] = useState([])
    const [applications, setApplications] = useState([])
    const [selectedProposal, setSelectedProposal] = useState(null)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const { isAuthenticated, authLoading } = useAuth()
    const router = useRouter()
  
    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/auth")
      }
    }, [isAuthenticated, router])

    useEffect(() => {
        async function fetchProposals() {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposal/investor`, {
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch proposals')
                }

                const data = await response.json()

                console.log(data);
                setProposals(data)
            } catch (error) {
                console.error('Error fetching proposals:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProposals()
    }, [])

    useEffect(() => {
        console.log(selectedProposal?._id);
        if (!selectedProposal) return

        async function fetchApplications() {
            setLoading(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/submissions/${selectedProposal?._id}`,
                    { credentials: 'include' }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch applications')
                }

                const data = await response.json()
                setApplications(data)
            } catch (error) {
                console.error('Error fetching applications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [selectedProposal])

    const handleApprove = async (applicationId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/submission/approve/${applicationId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                throw new Error('Failed to approve application')
            }

            setApplications(applications.map(app =>
                app._id === applicationId
                    ? { ...app, isApproved: true, isRejected: false }
                    : app
            ))

            if (selectedApplication && selectedApplication._id === applicationId) {
                setSelectedApplication({
                    ...selectedApplication,
                    isApproved: true,
                    isRejected: false
                })
            }
        } catch (error) {
            console.error('Error approving application:', error)
        }
    }

    const handleReject = async (applicationId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/submission/reject/${applicationId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                throw new Error('Failed to reject application')
            }

            setApplications(applications.map(app =>
                app._id === applicationId
                    ? { ...app, isApproved: false, isRejected: true }
                    : app
            ))

            if (selectedApplication && selectedApplication._id === applicationId) {
                setSelectedApplication({
                    ...selectedApplication,
                    isApproved: false,
                    isRejected: true
                })
            }
        } catch (error) {
            console.error('Error rejecting application:', error)
        }
    }

    const renderStatus = (application) => {
        if (application.isApproved) {
            return <Badge className="bg-green-100 text-green-800">Approved</Badge>
        }
        if (application.isRejected) {
            return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
        }
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }

    if (loading && !selectedProposal && !selectedApplication) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your investments...</p>
                </div>
            </div>
        )
    }

    if (selectedApplication) {
        return (
            <div className="container mx-auto py-6 max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => setSelectedApplication(null)}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to applications
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Application Details</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleReject(selectedApplication._id)}
                                    disabled={selectedApplication.isRejected}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => handleApprove(selectedApplication._id)}
                                    disabled={selectedApplication.isApproved}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {renderStatus(selectedApplication)}
                            {selectedApplication.isPaid && (
                                <Badge className="bg-purple-100 text-purple-800">Payment Received</Badge>
                            )}
                            <Badge className="bg-blue-100 text-blue-800">
                                Submitted {formatDistanceToNow(new Date(selectedApplication.createdAt), { addSuffix: true })}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Applicant Email</h3>
                                <p className="mt-1">{selectedApplication.email}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Form Submissions</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    {selectedApplication.submittedData && Object.entries(selectedApplication.submittedData).map(([key, value]) => (
                                        <div key={key} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                            <h4 className="text-sm font-medium">{key}</h4>
                                            <p className="mt-1 text-gray-700">{value.toString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (selectedProposal) {
        return (
            <div className="container mx-auto py-6">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => setSelectedProposal(null)}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to proposals
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Applications for {selectedProposal.domain} Investment</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            ${selectedProposal.amount.toLocaleString()} - {selectedProposal.type}
                        </p>
                    </CardHeader>

                    <CardContent>
                        {applications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No applications received yet for this proposal.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow key={application._id}>
                                            <TableCell>{application.email}</TableCell>
                                            <TableCell>
                                                {new Date(application.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{renderStatus(application)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedApplication(application)}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <Tabs defaultValue="active">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Investments</h1>
                    <TabsList>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active">
                    {proposals.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    You haven't created any investment proposals yet.
                                </p>
                                <Button onClick={() => router.push('/create-proposal')}>
                                    Create Your First Proposal
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {proposals.map((proposal) => (
                                <Card key={proposal._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{proposal.domain}</CardTitle>
                                        <p className="text-muted-foreground">${proposal.amount.toLocaleString()}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Type:</span>
                                                <span>{proposal.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Status:</span>
                                                <Badge variant={proposal.isPublic ? "success" : "secondary"}>
                                                    {proposal.isPublic ? "Public" : "Private"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Created:</span>
                                                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setSelectedProposal(proposal)}
                                        >
                                            View Applications
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="archived">
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground">
                                No archived investments found.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}