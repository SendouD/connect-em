"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, ChevronLeft, CheckCircle, XCircle, Download, FileText, Image as ImageIcon, ExternalLink, Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ApplicationsGraph from '@/components/Line'
import UserDashboard from '@/components/UserDashboard'
import UserPitch from '@/components/User-pitches'
import ProtectedRoute from '@/components/routes/ProtectedRoute'

export default function InvestorDashboard() {
    const [proposals, setProposals] = useState([])
    const [applications, setApplications] = useState([])
    const [selectedProposal, setSelectedProposal] = useState(null)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

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

    // Helper function to check if a string is an image URL
    const isImageFile = (filename) => {
        if (!filename) return false;
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const extension = filename.split('.').pop().toLowerCase();
        return extensions.includes(extension);
    }

    // Helper function to get file type icon
    const getFileIcon = (filename) => {
        if (!filename) return <FileText />;
        const extension = filename.split('.').pop().toLowerCase();
        
        const iconMap = {
            pdf: <FileText className="text-red-500" />,
            doc: <FileText className="text-blue-500" />,
            docx: <FileText className="text-blue-500" />,
            xls: <FileText className="text-green-500" />,
            xlsx: <FileText className="text-green-500" />,
            txt: <FileText className="text-gray-500" />,
            // Add more file types as needed
        };
        
        return iconMap[extension] || <FileText />;
    }

    // Render form field based on its type and value
    const renderFormField = (key, value) => {
        // Skip rendering internal fields
        if (key.startsWith('_') || key === 'id') return null;

        // Handle image display
        if (typeof value === 'string' && isImageFile(value)) {
            return (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">{key}</h4>
                    <div className="mt-2 relative">
                        <div className="relative h-64 w-full rounded-md overflow-hidden border border-gray-200">
                            <Image 
                                src={`${value}`}
                                alt={key}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => window.open(`${value}`, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Size
                        </Button>
                    </div>
                </div>
            );
        }

        if (typeof value === 'string' && value.includes('.')) {
            return (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">{key}</h4>
                    <div className="flex items-center mt-2 p-2 border border-gray-200 rounded-md">
                        {getFileIcon(value)}
                        <span className="ml-2 text-sm truncate flex-grow">{value}</span>
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${value}`, '_blank')}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            );
        }

        // Handle array of files or images
        if (Array.isArray(value)) {
            return (
                <div className="mt-2">
                    <h4 className="text-sm font-medium">{key}</h4>
                    <div className="space-y-2 mt-2">
                        {value.map((item, index) => {
                            if (typeof item === 'string' && isImageFile(item)) {
                                return (
                                    <div key={index} className="relative h-64 w-full rounded-md overflow-hidden border border-gray-200">
                                        <Image 
                                            src={`${item}`}
                                            alt={`${key}-${index}`}
                                            fill
                                            className="object-contain"
                                        />
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="absolute bottom-2 right-2 bg-white"
                                            onClick={() => window.open(`${item}`, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                );
                            } else if (typeof item === 'string' && item.includes('.')) {
                                return (
                                    <div key={index} className="flex items-center p-2 border border-gray-200 rounded-md">
                                        {getFileIcon(item)}
                                        <span className="ml-2 text-sm truncate flex-grow">{item}</span>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => window.open(`${item}`, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                );
                            } else {
                                return <div key={index} className="text-gray-700">{item.toString()}</div>;
                            }
                        })}
                    </div>
                </div>
            );
        }

        // Handle regular text/data
        return (
            <div className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                <h4 className="text-sm font-medium">{key}</h4>
                <p className="mt-1 text-gray-700">{value.toString()}</p>
            </div>
        );
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
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Application Submissions</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    {selectedApplication.submittedData && Object.entries(selectedApplication.submittedData).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            {renderFormField(key, value)}
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
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Grants
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
                                No applications received yet for this Grant.
                            </div>
                        ) : (
                            <> <ApplicationsGraph applications={applications} />
                            <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Applicant</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Media</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((application) => {
                                            // Count media files (images and documents)
                                            let mediaCount = 0
                                            if (application.submittedData) {
                                                Object.values(application.submittedData).forEach(value => {
                                                    if (typeof value === 'string' && value.includes('.')) {
                                                        mediaCount++
                                                    } else if (Array.isArray(value)) {
                                                        value.forEach(item => {
                                                            if (typeof item === 'string' && item.includes('.')) {
                                                                mediaCount++
                                                            }
                                                        })
                                                    }
                                                })
                                            }

                                            return (
                                                <TableRow key={application._id}>
                                                    <TableCell>{application.email}</TableCell>
                                                    <TableCell>
                                                        {new Date(application.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>{renderStatus(application)}</TableCell>
                                                    <TableCell>
                                                        {mediaCount > 0 ? (
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                {isImageFile(Object.values(application.submittedData)[0]) ?
                                                                    <ImageIcon className="h-3 w-3" /> :
                                                                    <FileText className="h-3 w-3" />}
                                                                {mediaCount} {mediaCount === 1 ? 'file' : 'files'}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-gray-400">No files</span>
                                                        )}
                                                    </TableCell>
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
                                            )
                                        })}
                                    </TableBody>
                                </Table></>

                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <ProtectedRoute>
            <div className="container mx-auto py-6">
                <Tabs defaultValue="grants">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <TabsList>
                            <TabsTrigger value="grants">Grants</TabsTrigger>
                            <TabsTrigger value="applied-grants">Applied Grants</TabsTrigger>
                            <TabsTrigger value="pitches">Pitches</TabsTrigger>

                        </TabsList>
                    </div>

                    <TabsContent value="grants">
                    <div className="container mx-auto py-8 px-4">

                    <h1 className="text-3xl font-bold mb-6">Posted Grants</h1>

                        {proposals.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">
                                        You haven't posted any Grants yet.
                                    </p>
                                    <Button onClick={() => router.push('/create-proposal')}>
                                        Post Your First Grant
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {proposals.map((proposal) => (
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
                                                <span className="truncate" title={proposal.email}>{proposal.email} (You)</span>
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
                    </div>
                    </TabsContent>

                    <TabsContent value="applied-grants">
                    <UserDashboard/>
                    </TabsContent>
                    <TabsContent value="pitches">
                        <UserPitch/>
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoute>
    )
}