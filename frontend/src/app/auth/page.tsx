"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const emailSignInRef = useRef<HTMLInputElement>(null);
  const passwordSignInRef = useRef<HTMLInputElement>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInSuccess, setSignInSuccess] = useState<string | null>(null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailSignUpRef = useRef<HTMLInputElement>(null);
  const passwordSignUpRef = useRef<HTMLInputElement>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("signin");

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSignInSuccess(null);

    if (!emailSignInRef.current || !passwordSignInRef.current) {
      setSignInError("All fields are required.");
      return;
    }

    const email = emailSignInRef.current.value.trim();
    const password = passwordSignInRef.current.value.trim();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials");
      }

      const data = await response.json().catch(() => null);
      if (data) {
        console.log("Login successful:", data);
        setSignInSuccess("Login successful!");
        router.push('/');
      } else {
        setSignInError("Unexpected server response.");
      }
    } catch (error: any) {
      setSignInError(error.message || "Error occurred.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccess(null);

    if (
      !firstNameRef.current ||
      !lastNameRef.current ||
      !emailSignUpRef.current ||
      !passwordSignUpRef.current ||
      !usernameRef.current
    ) {
      setSignUpError("All fields are required.");
      return;
    }

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailSignUpRef.current.value.trim();
    const password = passwordSignUpRef.current.value.trim();
    const username = usernameRef.current.value.trim();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, username }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setSignUpSuccess("Account created successfully! You can now sign in.");
      
      setTimeout(() => {
        setActiveTab("signin");
      }, 2000);
    } catch (error: any) {
      setSignUpError(error.message || "Error occurred during registration.");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
          <TabsList className="grid grid-cols-2 mt-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="pt-4">
          <AnimatePresence mode="wait">
            <TabsContent value="signin" key="signin" asChild>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSignIn} className="space-y-4">
                  {signInError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signInError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {signInSuccess && (
                    <Alert className="bg-green-50 text-green-700 border-green-200 py-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{signInSuccess}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Input
                      ref={emailSignInRef}
                      type="email"
                      placeholder="Email"
                      required
                    />
                    <Input
                      ref={passwordSignInRef}
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="signup" key="signup" asChild>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSignUp} className="space-y-4">
                  {signUpError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signUpError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {signUpSuccess && (
                    <Alert className="bg-green-50 text-green-700 border-green-200 py-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{signUpSuccess}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      ref={firstNameRef}
                      type="text"
                      placeholder="First name"
                      required
                    />
                    <Input
                      ref={lastNameRef}
                      type="text"
                      placeholder="Last name"
                      required
                    />
                  </div>
                  
                  <Input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    required
                  />
                  <Input
                    ref={emailSignUpRef}
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <Input
                    ref={passwordSignUpRef}
                    type="password"
                    placeholder="Password"
                    required
                  />
                  
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === "signin" ? (
            <p>Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("signup")}>Sign up</Button></p>
          ) : (
            <p>Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("signin")}>Sign in</Button></p>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
}