"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ArrowRight, Save, FileText, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvestmentForm } from '@/components/investment-form';
import { FormSelection } from '@/components/form-selection';
import { ProposalVisibility } from '@/components/proposal-visibility';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

interface FormElement {
  type: string;
  options?: string[];
  input?: boolean;
  label: string;
  key: string;
  inputType?: string;
  placeholder?: string;
  validate?: {
    required?: boolean;
  };
}

interface FormData {
  _id: string;
  name: string;
  components: FormElement[];
}

function ProposalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { isAuthenticated, authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])
  
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    investments: [
      { domain: "", type: "", amount: "" }
    ],
    selectedForm: "old",
    formId: "",
    formName: "New Form",
    isPublic: true
  });

  useEffect(() => {
    async function fetchForms() {
      setIsLoadingForms(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/get-all`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Fetched forms:", data);
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setIsLoadingForms(false);
      }
    }
    fetchForms();
  }, []);

  const fetchFormDetails = async (formId: string) => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/${formId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSelectedForm(data);
    } catch (error) {
      console.error("Error fetching form details:", error);
      setSelectedForm(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleFormSelection = (value: any) => {
    setProposalData({
      ...proposalData,
      selectedForm: value,
      formId: value === "new" ? "" : value
    });
    
    if (value !== "new") {
      fetchFormDetails(value);
    } else {
      setSelectedForm(null);
    }
  };

  const handleFormNameChange = (e: any) => {
    setProposalData({
      ...proposalData,
      formName: e.target.value
    });
  };

  const handlePublicToggle = (value: any) => {
    setProposalData({
      ...proposalData,
      isPublic: value === "public"
    });
  };

  const handleTitleChange = (e: any) => {
    setProposalData({
      ...proposalData,
      title: e.target.value
    });
  };

  const handleDescriptionChange = (e: any) => {
    setProposalData({
      ...proposalData,
      description: e.target.value
    });
  };

  const nextStep = () => {
    setCurrentStep(2);
  };
  
  const prevStep = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    console.log(proposalData);
  },[proposalData])
  
  const submitProposal = async () => {
    console.log("Submitting Grant:", proposalData);
    
    if (proposalData.selectedForm === "new") {
      const queryParams = new URLSearchParams({
        title: proposalData.title,
        description: proposalData.description,
        investments: JSON.stringify(proposalData.investments),
        isPublic: proposalData.isPublic.toString(),
        formName: proposalData.formName
      }).toString();
      
      router.push(`/proposal-form/new?${queryParams}`);
    } else {
      try {
        const response1 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/copy-template/${proposalData.formId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const proposalForm = await response1.json();
        console.log(proposalForm)

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposal/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: proposalData.title,
            description: proposalData.description,
            investments: proposalData.investments,
            formId: proposalForm._id,
            isPublic: proposalData.isPublic
          }),
        });
        
        const result = await response.json();
        
        if (response.ok) {

          setProposalData({
            title: "",
            description: "",
            investments: [{ domain: "", type: "", amount: "" }],
            selectedForm: "new",
            formId: "",
            formName: "",
            isPublic: true
          });
          setCurrentStep(1);
        } else {
          console.log("Failed to submit Grant");
        }
      } catch (error) {
        console.error("Error submitting grant:", error);
      }
    }
  };

  const isStep1Valid = () => {
    return (
      proposalData.title.trim() !== "" && 
      proposalData.description.trim() !== "" && 
      proposalData.investments.every(inv => 
        inv.domain && inv.type && inv.amount && !isNaN(Number(inv.amount))
      )
    );
  };
  
  const isStep2Valid = () => {
    if (proposalData.selectedForm === "new") {
      return proposalData.formName.trim() !== "";
    }
    return proposalData.selectedForm !== "new" && proposalData.formId !== "";
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 max-w-3xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Grant</CardTitle>
            <CardDescription>Complete the two-step process to submit your grant</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className={`flex-1 text-center p-2 rounded-l-md ${currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  Step 1: Grant Details
                </div>
                <div className={`flex-1 text-center p-2 rounded-r-md ${currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  Step 2: Template Selection
                </div>
              </div>
            </div>
            
            {currentStep === 1 && (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="proposal-title">Grant Title</Label>
                    <Input 
                      id="proposal-title" 
                      placeholder="Enter a title for your grant"
                      value={proposalData.title}
                      onChange={handleTitleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="proposal-description">Grant Description</Label>
                    <Textarea 
                      id="proposal-description" 
                      placeholder="Provide a brief description of your investment grant"
                      value={proposalData.description}
                      onChange={handleDescriptionChange}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
                
                <InvestmentForm 
                  proposalData={proposalData}
                  setProposalData={setProposalData}
                />
              </>
            )}
            
            {currentStep === 2 && (
              <FormSelection 
                proposalData={proposalData}
                setProposalData={setProposalData}
                forms={forms}
                isLoadingForms={isLoadingForms}
                handleFormSelection={handleFormSelection}
                handleFormNameChange={handleFormNameChange}
                fetchFormDetails={fetchFormDetails}
                selectedForm={selectedForm}
                isLoadingPreview={isLoadingPreview}
                isPreviewOpen={isPreviewOpen}
                setIsPreviewOpen={setIsPreviewOpen}
              />
            )}
            
            <ProposalVisibility 
              isPublic={proposalData.isPublic}
              handlePublicToggle={handlePublicToggle}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {currentStep === 1 ? (
              <div></div>
            ) : (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            
            {currentStep === 1 ? (
              <Button 
                onClick={nextStep} 
                disabled={!isStep1Valid()}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={submitProposal}
                disabled={!isStep2Valid()}
                className="gap-2"
              >
                {proposalData.selectedForm === "new" ? (
                  <>Continue to Template Builder <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Submit Grant <Save className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

export default ProposalPage;