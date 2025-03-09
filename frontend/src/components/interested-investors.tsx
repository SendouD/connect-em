// InvestorsInterested.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";

interface InvestorsInterestedProps {
  investors: string[];
  currentUserEmail?: string;
  onShowInterest: () => Promise<void>;
  isInterested: boolean;
}

export function InvestorsInterested({
  investors,
  currentUserEmail,
  onShowInterest,
  isInterested,
}: InvestorsInterestedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInterest = async () => {
    setIsLoading(true);
    try {
      await onShowInterest();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initials from email
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  // Get a consistent color based on email
  const getAvatarColor = (email: string) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant={isInterested ? "default" : "outline"}
          size="sm"
          onClick={handleInterest}
          disabled={isLoading || isInterested}
          className={isInterested ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Heart className={`h-4 w-4 mr-2 ${isInterested ? "fill-current" : ""}`} />
          {isInterested ? "Interested" : "Show Interest"}
        </Button>

        <div className="flex items-center">
          {investors.length > 0 && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="flex -space-x-2 overflow-hidden cursor-pointer">
                  {investors.slice(0, 3).map((investor, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="border-2 border-background inline-block">
                            <AvatarFallback className={getAvatarColor(investor)}>
                              {getInitials(investor)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{investor}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {investors.length > 3 && (
                    <Avatar className="border-2 border-background inline-block">
                      <AvatarFallback className="bg-gray-400">
                        +{investors.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Interested Investors</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
                  {investors.map((investor, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2">
                      <Avatar>
                        <AvatarFallback className={getAvatarColor(investor)}>
                          {getInitials(investor)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {investor}
                          {investor === currentUserEmail && " (You)"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {investors.length > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {investors.length} {investors.length === 1 ? "investor" : "investors"} interested
            </span>
          )}
        </div>
      </div>
    </div>
  );
}