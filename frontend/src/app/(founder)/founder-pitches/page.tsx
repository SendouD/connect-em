"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Pitch {
  _id: string
  domain: string
  type: string
  email: string
  formId: string
  createdAt: string
  investors: [string]
  title: string        
  description: string
}

function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pitch/get-all`)
        const data = await response.json()
        if (response.ok) {
          setPitches(data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        console.error(err)
        setError("An error occurred while fetching pitches")
      } finally {
        setLoading(false)
      }
    }

    fetchPitches()
  }, [])

  const handleCardClick = (pitchId: string) => {
    router.push(`/pitch/${pitchId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Startup Pitches</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
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
      <h1 className="text-3xl font-bold mb-6">Startup Pitches</h1>
      {pitches.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pitches.map((pitch) => (
            <div 
              key={pitch._id} 
              onClick={() => handleCardClick(pitch._id)}
              className="cursor-pointer transition-all hover:shadow-md"
            >
              <Card className="h-48 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{pitch.title || pitch.domain}</span>
                    <Badge>{pitch.type}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2 text-sm">
                    {pitch.description || `A startup in the ${pitch.domain} domain`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Submitted by:</span>
                      <span className="font-medium">{pitch.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Submitted on:</span>
                      <span>{formatDate(pitch.createdAt)}</span>
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
            <CardTitle>No Pitches Found</CardTitle>
            <CardDescription>There are currently no startup pitches to display.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

export default PitchesPage