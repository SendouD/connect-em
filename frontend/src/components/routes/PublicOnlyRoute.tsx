"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LoadingScreen from "@/components/LoadingScreen";

export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return !isAuthenticated ? <>{children}</> : null;
}