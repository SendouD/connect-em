"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Loader2, Upload, X, FileIcon, ImageIcon, DollarSign } from 'lucide-react'
import axios from "axios"
import Image from "next/image"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useTheme } from "next-themes"

interface FormElement {
  type: string
  options?: string[]
  input: boolean
  label: string
  key: string
  inputType?: string
  placeholder?: string
  multiple?: boolean
  fileTypes?: string[]
  validate?: {
    required?: boolean
  }
}

interface FormData {
  name: string
  components: FormElement[]
}

interface Proposal {
  _id: string
  domain: string
  type: string
  amount: number
  formId: string
  isPublic: boolean
  email?: string
  title?: string
  description?: string
}

export default function DynamicForm() {
  const [form, setForm] = useState<FormData | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { proposalId, id } = useParams()
  const [filledData, setFilledData] = useState<any>(null)
  const router = useRouter()
  const [fileUploads, setFileUploads] = useState<Record<string, File[]>>({})
  const [fileUrls, setFileUrls] = useState<Record<string, string[]>>({})
  const [fileUploadStatus, setFileUploadStatus] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const { theme } = useTheme();


  useEffect(() => {
    async function fetchFilledData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/get-filled-form/${proposalId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch filled form data");
        }
  
        let data = await response.json();
  
        if (data && data._id) {
          setFilledData(data);

          if (data.submittedData) {
            setFormValues(data.submittedData);
            
            const fileUrlFields: Record<string, string[]> = {};
            Object.entries(data.submittedData).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && 
                  (value[0].startsWith('http://') || value[0].startsWith('https://'))) {
                fileUrlFields[key] = value;
              }
            });
            
            if (Object.keys(fileUrlFields).length > 0) {
              setFileUrls(fileUrlFields);
            }
            
            console.log("Setting form values from submittedData:", data.submittedData);
          }
        }
      } catch (error) {
        console.error("Error fetching filled form data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function getProposal() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposal/${proposalId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch proposal data");
        }
  
        let data = await response.json();
  
        if (data && data._id) {
          console.log("Proposal data:", data);
          setProposal(data);
        }
      } catch (error) {
        console.error("Error fetching proposal data:", error);
      }
    }
  
    if (proposalId) {
      setIsLoading(true);
      fetchFilledData();
      getProposal();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    async function fetchFormData() {
      if (!id) return;
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/proposal-form/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch form structure");
        }

        const data: FormData = await response.json();

        console.log(data);
        setForm(data);
      } catch (error) {
        console.error("Error fetching form structure:", error);
      }
    }

    fetchFormData();
  }, [id]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (label: string, event: React.ChangeEvent<HTMLInputElement>, multiple: boolean = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
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
  }

  const removeFile = (label: string, index: number) => {
    setFileUploads(prev => {
      const updatedFiles = [...prev[label]];
      updatedFiles.splice(index, 1);
      return { ...prev, [label]: updatedFiles };
    });
    
    setFileUrls(prev => {
      const updatedUrls = [...prev[label]];
      URL.revokeObjectURL(updatedUrls[index]);
      updatedUrls.splice(index, 1);
      return { ...prev, [label]: updatedUrls };
    });
  }

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedFileUrls: any = {};
      if (Object.keys(fileUploads).length > 0) {
        uploadedFileUrls = await uploadFiles();
        if (!uploadedFileUrls) {
          setIsSubmitting(false);
          return;
        }
      }

      const submissionData = {
        ...formValues,
        ...uploadedFileUrls
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/submit/${proposalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      router.push(`/dashboard`);
      console.log("successfully submitted form");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const triggerFileInput = (label: string) => {
    if (fileInputRefs.current[label]) {
      fileInputRefs.current[label]?.click();
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading form...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!form) {
    return (
      <ProtectedRoute>
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">The requested form could not be loaded.</p>
        </div>
      </ProtectedRoute>
    )
  }

  const isFileField = (field: FormElement) => {
    return field.type === "file";
  }

  const isImageField = (field: FormElement) => {
    return field.type === "file" && field.key === "imageupload";
  }

  const isDocumentField = (field: FormElement) => {
    return field.type === "file" && field.key === "documentupload";
  }

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto mt-10 space-y-4">
        {proposal && (
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{proposal.title || "Untitled Proposal"}</span>
                <div className="flex items-center bg-primary-50 text-primary px-3 py-1 rounded-full text-sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {proposal.amount.toLocaleString()}
                </div>
              </CardTitle>
              {proposal.description && (
                <CardDescription className="mt-2">
                  {proposal.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Domain</p>
                  <p className="font-medium">{proposal.domain}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Type</p>
                  <p className="font-medium">{proposal.type}</p>
                </div>
                {proposal.email && (
                  <div>
                    <p className="text-muted-foreground mb-1">Contact</p>
                    <p className="font-medium">{proposal.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Visibility</p>
                  <p className="font-medium">{proposal.isPublic ? "Public" : "Private"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Submission Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{form.name}</CardTitle>
            {filledData && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filledData.isSubmitted && !filledData.isApproved && !filledData.isRejected && (
                  <div className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md inline-block">
                    Status: Pending Review
                  </div>
                )}
                {filledData.isApproved && (
                  <div className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md inline-block">
                    Status: Approved
                  </div>
                )}
                {filledData.isRejected && (
                  <div className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md inline-block">Status: Rejected</div>
                )}
                {!filledData.isSubmitted && !filledData.isApproved && !filledData.isRejected && (
                  <div className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md inline-block">Status: Draft</div>
                )}
                {filledData.isPaid && (
                  <div className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md inline-block">
                    Payment: Received
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            {filledData && filledData.isSubmitted && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                <p className="text-sm">This form has already been submitted and cannot be modified.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} id="dynamic-form" className="space-y-5">
              {form.components.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label htmlFor={field.label} className="text-sm font-medium mb-1.5 block">
                    {field.label}
                    {field.validate?.required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {field.type === "textfield" && field.inputType !== "date" && (
                    <Input
                      id={field.label}
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={formValues[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="transition-all duration-200"
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.label}
                      placeholder={field.placeholder || ""}
                      value={formValues[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="min-h-[120px] transition-all duration-200"
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    />
                  )}

                  {field.inputType === "date" && (
                    <Input
                      id={field.label}
                      type="date"
                      value={formValues[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="transition-all duration-200"
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      id={field.label}
                      type="number"
                      placeholder={field.placeholder || ""}
                      value={formValues[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="transition-all duration-200"
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    />
                  )}

                  {field.type === "password" && (
                    <Input
                      id={field.label}
                      type="password"
                      placeholder={field.placeholder || ""}
                      value={formValues[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="transition-all duration-200"
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    />
                  )}

                  {field.type === "checkbox" && (
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        id={field.label}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formValues[field.label] === "yes" || formValues[field.label] === true}
                        onChange={(e) => handleChange(field.label, e.target.checked ? "yes" : "no")}
                        required={field.validate?.required}
                        disabled={filledData && filledData.isSubmitted}
                      />
                      <Label htmlFor={field.label} className="text-sm font-normal">
                        {field.placeholder || "Yes"}
                      </Label>
                    </div>
                  )}

                  {field.type === "radio" && (
                    <div className="space-y-2 pt-1">
                      {field.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            id={`${field.label}-${option}`}
                            type="radio"
                            name={field.label}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            value={option}
                            checked={formValues[field.label] === option}
                            onChange={(e) => handleChange(field.label, e.target.value)}
                            required={field.validate?.required && !formValues[field.label]}
                            disabled={filledData && filledData.isSubmitted}
                          />
                          <Label htmlFor={`${field.label}-${option}`} className="text-sm font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === "select" && (
                    <Select
                      onValueChange={(value) => handleChange(field.label, value)}
                      value={formValues[field.label] || ""}
                      required={field.validate?.required}
                      disabled={filledData && filledData.isSubmitted}
                    >
                      <SelectTrigger className="w-full transition-all duration-200">
                        <SelectValue placeholder={field.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {isFileField(field) && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        id={`file-input-${field.label}`}
                        className="hidden"
                        accept={field.fileTypes?.map(type => `.${type}`).join(',')}
                        multiple={field.multiple || false}
                        onChange={(e) => handleFileChange(field.label, e, field.multiple || false)}
                        disabled={filledData && filledData.isSubmitted}
                        ref={(el) => fileInputRefs.current[field.label] = el}
                      />
                      
                      <div 
                        className={`border-2 border-dashed rounded-md p-4 text-center ${ (theme === "light") ?
                          (filledData && filledData.isSubmitted) ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer' : (filledData && filledData.isSubmitted) ? 'bg-gray-800 cursor-not-allowed' : 'hover:bg-gray-800 cursor-pointer'
                        }`}
                        onClick={() => !(filledData && filledData.isSubmitted) && triggerFileInput(field.label)}
                      >
                        {isImageField(field) ? (
                          <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        ) : (
                          <FileIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        )}
                        <p className="text-sm text-muted-foreground">
                          {fileUploadStatus[field.label] === "uploading" ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                            </span>
                          ) : fileUploadStatus[field.label] === "error" ? (
                            <span className="text-red-500">Upload failed. Click to try again.</span>
                          ) : fileUrls[field.label] && fileUrls[field.label].length > 0 ? (
                            `${fileUrls[field.label].length} file(s) selected`
                          ) : (
                            <>
                              {field.placeholder || `Upload ${field.label}`}
                              {field.fileTypes && field.fileTypes.length > 0 && (
                                <span className="block mt-1 text-xs">
                                  Allowed: {field.fileTypes.map(t => `.${t}`).join(", ")}
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                      
                      {fileUrls[field.label] && fileUrls[field.label].length > 0 && (
                        <div className="mt-3 space-y-2">
                          {fileUrls[field.label].map((url, index) => (
                            <div key={index} className={`flex items-center gap-2 ${(theme === "light") ? "bg-gray-50" : "bg-gray-800"} p-2 rounded`}>
                              {isImageField(field) && url.startsWith('blob:') ? (
                                <div className="w-10 h-10 relative">
                                  <Image
                                    src={url}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              ) : isImageField(field) && (url.startsWith('http://') || url.startsWith('https://')) ? (
                                <div className="w-10 h-10 relative">
                                  <Image
                                    src={url}
                                    alt={`Uploaded ${index}`}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <FileIcon className="w-5 h-5 text-blue-500" />
                              )}
                              
                              <span className="text-sm truncate flex-1">
                                {url.startsWith('blob:') 
                                  ? fileUploads[field.label][index].name 
                                  : url.split('/').pop()}
                              </span>
                              
                              {!(filledData && filledData.isSubmitted) && url.startsWith('blob:') && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(field.label, index);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {field.placeholder &&
                    field.inputType !== "password" &&
                    field.type !== "checkbox" &&
                    field.type !== "radio" &&
                    field.type !== "select" &&
                    field.type !== "file" && <p className="text-xs text-muted-foreground mt-1">{field.placeholder}</p>}
                </div>
              ))}
            </form>
          </CardContent>

          <CardFooter className="flex justify-end border-t p-4">
            <Button
              type="submit"
              form="dynamic-form"
              disabled={isSubmitting || (filledData && filledData.isSubmitted)}
              className="px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : filledData && filledData.isSubmitted ? (
                "Already Submitted"
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  )
}