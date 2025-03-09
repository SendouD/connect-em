"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, X, FileIcon, ImageIcon, Calendar } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import axios from 'axios';
import Image from 'next/image';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

const domainOptions = ["Software Development", "Hardware", "IT Infrastructure", "Research & Development"];
const typeOptions = {
  "Software Development": ["Web Development", "Mobile Apps", "Blockchain", "AI/ML", "Cloud Services"],
  "Hardware": ["IoT Devices", "Computing Hardware", "Network Equipment", "Custom Hardware"],
  "IT Infrastructure": ["Data Centers", "Cloud Infrastructure", "Security Systems", "Network Infrastructure"],
  "Research & Development": ["Basic Research", "Applied Research", "Prototyping", "Innovation Labs"],
};

interface FormElement {
  type: string;
  options?: string[];
  input?: boolean;
  label: string;
  key: string;
  inputType?: string;
  placeholder?: string;
  multiple?: boolean;
  fileTypes?: string[];
  validate?: {
    required?: boolean;
  };
}

interface FormData {
  _id: string;
  name: string;
  components: FormElement[];
}

function CreatePitchPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [pitchData, setPitchData] = useState({ formId: "", email: "", domain: "", type: "", title: "", description: "" });
  const { isAuthenticated, authLoading, user } = useAuth();
  const router = useRouter();
  const [fileUploads, setFileUploads] = useState<Record<string, File[]>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string[]>>({});
  const [fileUploadStatus, setFileUploadStatus] = useState<Record<string, string>>({});
  // Create a reference object for each file input
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.email) {
      setPitchData(prev => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, authLoading, router, user]);
  
  useEffect(() => {
    async function fetchForms() {
      setIsLoadingForms(true);
      setFetchError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/get-all`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch forms: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure that data is an array before setting it
        if (Array.isArray(data)) {
          setForms(data);
        } else if (data && data.forms && Array.isArray(data.forms)) {
          // If the API returns an object with a forms property that is an array
          setForms(data.forms);
        } else {
          console.error("Unexpected response format:", data);
          setFetchError("Invalid response format. Expected an array of forms.");
          setForms([]);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        setFetchError(error instanceof Error ? error.message : "Failed to fetch forms");
        setForms([]);
      } finally {
        setIsLoadingForms(false);
      }
    }
    fetchForms();
  }, []);

  // Update available types when domain changes
  useEffect(() => {
    if (pitchData.domain && typeOptions[pitchData.domain]) {
      setAvailableTypes(typeOptions[pitchData.domain]);
      // Reset the type when domain changes
      setPitchData(prev => ({ ...prev, type: "" }));
    } else {
      setAvailableTypes([]);
    }
  }, [pitchData.domain]);

  const handleDomainChange = (domain: string) => {
    setPitchData(prev => ({ ...prev, domain }));
  };

  const handleTypeChange = (type: string) => {
    setPitchData(prev => ({ ...prev, type }));
  };

  const handlePitchDataChange = (field: string, value: string) => {
    setPitchData(prev => ({ ...prev, [field]: value }));
  };

  const fetchFormDetails = async (formId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/${formId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch form details');
      }
      const data = await response.json();
      setSelectedForm(data);
      setPitchData(prev => ({ ...prev, formId: formId }));
      
      const initialFormData: Record<string, any> = {};
      data.components.forEach((component: FormElement) => {
        if (component.type === "checkbox") {
          initialFormData[component.label] = false;
        } else if (component.type === "radio" && component.options && component.options.length > 0) {
          initialFormData[component.label] = "";
        } else {
          initialFormData[component.label] = "";
        }
      });
      setFormData(initialFormData);
      
    } catch (error) {
      console.error("Error fetching form details:", error);
      setSelectedForm(null);
    }
  };

  const handleFormChange = (value: string) => {
    fetchFormDetails(value);
  };

  const handleInputChange = (label: string, value: any) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleFileChange = (label: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const component = selectedForm?.components.find(comp => comp.label === label);
    const multiple = component?.multiple || false;
  
    const fileList = multiple ? Array.from(files) : [files[0]];
  
    setFileUploads(prev => ({
      ...prev,
      [label]: fileList
    }));
  
    const urls = fileList.map(file => URL.createObjectURL(file));
    setFileUrls(prev => ({
      ...prev,
      [label]: urls
    }));
  };

  const removeFile = (label: string, fileIndex: number) => {
    setFileUploads(prev => {
      const updatedFiles = [...prev[label]];
      updatedFiles.splice(fileIndex, 1);
      return { ...prev, [label]: updatedFiles };
    });
  
    setFileUrls(prev => {
      const updatedUrls = [...prev[label]];
      URL.revokeObjectURL(updatedUrls[fileIndex]);
      updatedUrls.splice(fileIndex, 1);
      return { ...prev, [label]: updatedUrls };
    });
  };
  
  const uploadFiles = async () => {
    const uploadPreset = "hackathonform";
    const cloudName = "dgjqg72wo";
    const uploadedUrls: Record<string, string[]> = {};
    
    for (const [label, files] of Object.entries(fileUploads)) {
      setFileUploadStatus(prev => ({ ...prev, [label]: "uploading" }));
      const urls: string[] = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        
        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: false,
            }
          );
          
          urls.push(response.data.secure_url);
        } catch (error) {
          console.error("Error uploading file:", error);
          setFileUploadStatus(prev => ({ ...prev, [label]: "error" }));
          return null;
        }
      }
      
      uploadedUrls[label] = urls;
      setFileUploadStatus(prev => ({ ...prev, [label]: "complete" }));
    }
    
    return uploadedUrls;
  };

  const triggerFileInput = (label: string) => {
    if (fileInputRefs.current[label]) {
      fileInputRefs.current[label]?.click();
    }
  };

  const renderFormElement = (element: FormElement, index: number) => {
    switch (element.type) {
      case "text":
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={element.label}
              type="text"
              placeholder={element.placeholder || ""}
              value={formData[element.label] || ""}
              onChange={(e) => handleInputChange(element.label, e.target.value)}
              required={element.validate?.required}
            />
            {element.placeholder && 
              <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>
            }
          </div>
        );
      
      case "textarea":
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={element.label}
              placeholder={element.placeholder || ""}
              value={formData[element.label] || ""}
              onChange={(e) => handleInputChange(element.label, e.target.value)}
              required={element.validate?.required}
              className="min-h-[120px]"
            />
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
      
      case "date":
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={element.label}
                type="date"
                value={formData[element.label] || ""}
                onChange={(e) => handleInputChange(element.label, e.target.value)}
                required={element.validate?.required}
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
      
      case "number":
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={element.label}
              type="number"
              placeholder={element.placeholder || ""}
              value={formData[element.label] || ""}
              onChange={(e) => handleInputChange(element.label, e.target.value)}
              required={element.validate?.required}
            />
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
      
      case "select":
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <Select 
              value={formData[element.label] || ""} 
              onValueChange={(value) => handleInputChange(element.label, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={element.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
      
      case "radio":
        return (
          <div className="mb-4">
            <Label className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {element.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <input
                    id={`${element.label}-${option}`}
                    type="radio"
                    name={element.label}
                    value={option}
                    checked={formData[element.label] === option}
                    onChange={() => handleInputChange(element.label, option)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    required={element.validate?.required && !formData[element.label]}
                  />
                  <Label htmlFor={`${element.label}-${option}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
      
      case "checkbox":
        return (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                id={element.label}
                type="checkbox"
                checked={!!formData[element.label]}
                onChange={(e) => handleInputChange(element.label, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required={element.validate?.required}
              />
              <Label htmlFor={element.label} className="text-sm font-normal">
                {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
              </Label>
            </div>
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );

      case "file":
        const isImage = element.key.includes("image");
        return (
          <div className="mb-4">
            <Label className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <input
              type="file"
              id={`file-input-${element.label}`}
              className="hidden"
              accept={element.fileTypes?.map(type => `.${type}`).join(',')}
              multiple={element.multiple || false}
              onChange={(e) => handleFileChange(element.label, e)}
              ref={(el) => fileInputRefs.current[element.label] = el}
            />

            <div 
              className="border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 cursor-pointer"
              onClick={() => triggerFileInput(element.label)}
            >
              {isImage ? (
                <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              ) : (
                <FileIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {fileUploadStatus[element.label] === "uploading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </span>
                ) : fileUploadStatus[element.label] === "error" ? (
                  "Upload failed. Click to try again."
                ) : fileUrls[element.label] && fileUrls[element.label].length > 0 ? (
                  `${fileUrls[element.label].length} file(s) selected`
                ) : (
                  <>
                    {element.placeholder || `Upload ${isImage ? "images" : "documents"}`}
                    {element.fileTypes && element.fileTypes.length > 0 && (
                      <span className="block mt-1 text-xs">
                        Allowed: {element.fileTypes.map(t => `.${t}`).join(", ")}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            {fileUrls[element.label] && fileUrls[element.label].length > 0 && (
              <div className="mt-3 space-y-2">
                {fileUrls[element.label].map((url, fileIndex) => (
                  <div key={fileIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    {isImage ? (
                      <div className="w-10 h-10 relative">
                        <Image
                          src={url}
                          alt={`Preview ${fileIndex}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <FileIcon className="w-5 h-5 text-blue-500" />
                    )}

                    <span className="text-sm truncate flex-1">
                      {fileUploads[element.label][fileIndex].name}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(element.label, fileIndex);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <Label htmlFor={element.label} className="block mb-2">
              {element.label} {element.validate?.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={element.label}
              type="text"
              placeholder={element.placeholder || ""}
              value={formData[element.label] || ""}
              onChange={(e) => handleInputChange(element.label, e.target.value)}
              required={element.validate?.required}
            />
            {element.placeholder && <p className="text-xs text-muted-foreground mt-1">{element.placeholder}</p>}
          </div>
        );
    }
  };

  const isFormValid = () => {
    if (!selectedForm) return false;
    
    // Check if domain and type are selected
    if (!pitchData.domain || !pitchData.type) {
      return false;
    }
    
    // Check if title and description are provided
    if (!pitchData.title || !pitchData.description) {
      return false;
    }
    
    for (const component of selectedForm.components) {
      if (component.validate?.required && !formData[component.label] && component.type !== "file") {
        return false;
      }
      
      if (component.type === "file" && component.validate?.required) {
        if (!fileUploads[component.label] || fileUploads[component.label].length === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const submitPitch = async () => {
    setIsSubmitting(true);
    try {
      const copyTemplateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pitch/copy-template/${pitchData.formId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: pitchData.email || user?.email,
        }),
      });
      
      if (!copyTemplateResponse.ok) {
        const errorData = await copyTemplateResponse.json();
        throw new Error(errorData.message || "Failed to copy template");
      }
      
      const copyResult = await copyTemplateResponse.json();
      console.log(copyResult);
      const newFormId = copyResult._id;
      
      let uploadedFileUrls = {};
      if (Object.keys(fileUploads).length > 0) {
        const result = await uploadFiles();
        if (!result) {
          setIsSubmitting(false);
          return;
        }
        uploadedFileUrls = result;
      }
      
      const submittedData: Record<string, any> = {};
      
      if (selectedForm) {
        selectedForm.components.forEach(component => {
          if (component.type === "file" && uploadedFileUrls[component.label]) {
            submittedData[component.label] = uploadedFileUrls[component.label];
          } 
          else if (formData[component.label] !== undefined) {
            submittedData[component.label] = formData[component.label];
          }
        });
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pitch/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: newFormId,
          email: pitchData.email || user?.email,
          domain: pitchData.domain,
          type: pitchData.type,
          title: pitchData.title,
          description: pitchData.description,
          submittedData: submittedData
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert("Pitch submitted successfully!");
        router.push("/dashboard");
      } else {
        alert(`Error: ${result.message || "Failed to submit pitch"}`);
      }
    } catch (error) {
      console.error("Error submitting pitch:", error);
      alert(`Failed to submit pitch: ${error instanceof Error ? error.message : "Please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Pitch</CardTitle>
            <CardDescription>Select a form and provide details for your pitch</CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Title and Description Fields */}
            <div className="mb-6 space-y-4">
              <div>
                <Label htmlFor="pitch-title" className="block mb-2">
                  Pitch Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pitch-title"
                  type="text"
                  placeholder="Enter a title for your pitch"
                  value={pitchData.title}
                  onChange={(e) => handlePitchDataChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pitch-description" className="block mb-2">
                  Pitch Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="pitch-description"
                  placeholder="Provide a brief description of your pitch"
                  value={pitchData.description}
                  onChange={(e) => handlePitchDataChange('description', e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Domain and Type Selection */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domain-select" className="block mb-2">
                  Domain <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={handleDomainChange} value={pitchData.domain}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domainOptions.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type-select" className="block mb-2">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={handleTypeChange} 
                  value={pitchData.type}
                  disabled={!pitchData.domain}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={pitchData.domain ? "Select type" : "Select domain first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          
            <div className="mb-6">
              <Label htmlFor="form-select" className="block mb-2">
                Select Form <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleFormChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a form template" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingForms ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                      Loading forms...
                    </SelectItem>
                  ) : fetchError ? (
                    <SelectItem value="error" disabled>
                      <X className="h-4 w-4 mr-2 inline text-red-500" />
                      Error loading forms
                    </SelectItem>
                  ) : forms.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No forms available
                    </SelectItem>
                  ) : (
                    // Ensure forms is an array before mapping
                    Array.isArray(forms) && forms.map((form) => (
                      <SelectItem key={form._id} value={form._id}>
                        {form.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {fetchError && (
                <p className="text-sm text-red-500 mt-1">
                  {fetchError}
                </p>
              )}
            </div>
            
            {selectedForm && (
              <div className="space-y-4">
                {selectedForm.components.map((component, index) => 
                  renderFormElement(component, index)
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end border-t p-4">
            {selectedForm && (
              <Button 
                onClick={submitPitch} 
                disabled={isSubmitting || !isFormValid()}
                className="px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Submit Pitch 
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

export default CreatePitchPage;