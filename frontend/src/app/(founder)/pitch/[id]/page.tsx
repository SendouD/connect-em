"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Calendar,
  Mail,
  FileText,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAuth } from '@/providers/AuthProvider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { InvestorsInterested } from "@/components/interested-investors";

interface InvestorsInterestedProps {
  investors: string[];
  currentUserEmail?: string;
  onShowInterest: () => Promise<void>;
  isInterested: boolean;
}



interface Pitch {
  _id: string;
  domain: string;
  type: string;
  email: string;
  formId: string;
  createdAt: string;
  investors: string[];
  submittedData?: Record<string, any>;
  isPaid: boolean;
  title: string;
  description: string;
}



export default function PitchDetailPage() {
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { id } = useParams();
  const [isInterest, setIsInterest] = useState<boolean>(false);
  const { user, isAuthenticated, authLoading } = useAuth();


  useEffect(() => {
    const fetchPitch = async () => {
      try {
        console.log(user);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pitch/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setPitch(data);
          console.log(data)
          // Check if the current user's email is in the investors array
           if (!authLoading && isAuthenticated && user?.email)  {
            console.log("hitt")
            console.log(data.investors.includes(user.email));

            setIsInterest(data.investors.includes(user.email));

          }
        } else {
          setError(data.message || "Failed to fetch pitch details");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching pitch details");
      } finally {
        setLoading(false);
      }
    };

    fetchPitch();
  }, [id,isAuthenticated,authLoading,user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const handleInterest = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pitch/investor-interest/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setPitch((prev) => prev ? { ...prev, investors: data.investors } : null);
      setIsInterest(true);
    } catch (error) {
      console.error(error);
      setError("An error occurred while updating pitch interest");
    }
  };
  
 


  const renderSubmittedData = () => {
    if (!pitch?.submittedData) return null;

    return Object.entries(pitch.submittedData).map(([label, value], index) => {
      // Handle array of links
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string"
      ) {
        return (
          <div key={index} className="space-y-3 mb-6">
            <h3 className="text-lg font-medium">{label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {value.map((link: string, linkIndex: number) => {
                if (isImageUrl(link)) {
                  return (
                    <div
                      key={linkIndex}
                      className="relative border rounded-lg overflow-hidden group"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={link || "/placeholder.svg"}
                          alt={`${label} image ${linkIndex + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-black p-2 rounded-full"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <a
                      key={linkIndex}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="text-sm truncate flex-1">
                        Document {linkIndex + 1}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>

                  );
                }
              })}
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-medium">{label}</h3>
          <p className="text-muted-foreground mt-1">{String(value)}</p>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40 ml-4" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The requested pitch could not be found.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Pitch Details</h1>
        </div>
        <Badge variant={pitch.isPaid ? "success" : "secondary"} className="h-6">
          {pitch.isPaid ? "Paid" : "Unpaid"}
        </Badge>
      </div>

      <Card className="mb-8">
            
      <CardHeader>
        <CardTitle className="text-2xl">{pitch.title}</CardTitle>
        <CardDescription className="">{pitch.description}</CardDescription>
        <CardDescription className="flex items-center my-2">
          <Badge variant="outline" className="mr-2">
            {pitch.domain}
          </Badge>
          <Badge variant="outline" className="mr-2">
            {pitch.type}
          </Badge>
          <span className="text-sm">
            Submitted on {formatDate(pitch.createdAt)}
          </span>
        </CardDescription>
        
        <InvestorsInterested 
          investors={pitch.investors || []}
          currentUserEmail={user?.email}
          onShowInterest={handleInterest}
          isInterested={isInterest}
        />
      </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>Contact Email</span>
              </div>
              <p className="font-medium">{pitch.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created At</span>
              </div>
              <p className="font-medium">{formatDate(pitch.createdAt)}</p>
            </div>
          </div>

          {pitch.investors && pitch.investors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Investors</h3>
              <div className="flex flex-wrap gap-2">
                {pitch.investors.map((investor, index) => (
                  <Badge key={index} variant="secondary">
                    {investor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Submitted Information</h2>
            {renderSubmittedData()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
