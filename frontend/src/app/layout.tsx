import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./toast-styles.css"
import Header from "@/components/Header";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ash",
  description: "yay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                className: "rounded-md shadow-lg border border-border",
                style: {
                  padding: '16px',
                }
              }}
            />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
