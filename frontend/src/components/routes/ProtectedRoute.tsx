"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, router, pathname]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
