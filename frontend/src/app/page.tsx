"use client"

import React from 'react';
import { ArrowRight, TrendingUp, FileText, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-6xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Connect <span className="text-blue-600">Investors</span> with <span className="text-blue-600">Founders</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Streamline the investment process with our platform that connects visionary founders 
          with strategic investors through customized applications and efficient reviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/create-proposal')}>
            I'm an Investor <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/create-pitch')}>
            I'm a Founder <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create Grants</h3>
              <p className="text-gray-600">
                Investors can create detailed investment proposals specifying domains, 
                investment types, and criteria for potential founders.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-indigo-500">
            <CardContent className="pt-6">
              <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Application Forms</h3>
              <p className="text-gray-600">
                Design dynamic application forms tailored to your investment needs and gather 
                the exact information you need from founders.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Efficient Shortlisting</h3>
              <p className="text-gray-600">
                Review applications, approve promising founders, and manage your investment pipeline 
                with a streamlined decision process.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-12 px-4 rounded-lg max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Trusted by investors and founders</h2>
          <p className="text-gray-600">Join our growing community of investors and founders</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-gray-600">Investors</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">2,000+</p>
            <p className="text-gray-600">Founders</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">$50M+</p>
            <p className="text-gray-600">Investments</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-gray-600">Satisfaction</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}