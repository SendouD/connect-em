"use client"

import { useTheme } from "next-themes";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { theme } = useTheme();

    return (
        <div className={`flex items-center justify-center min-h-screen ${(theme === "light") ? "bg-gray-50" : "bg-gray-800" } px-4`}>
            {children}
        </div>
    );
  }