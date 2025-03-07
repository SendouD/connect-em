"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface FormElement {
  type: string
  options?: string[]
  input: boolean
  label: string
  key: string
  inputType?: string
  placeholder?: string
  validate?: {
    required?: boolean
  }
}

interface FormData {
  name: string
  components: FormElement[]
}

export default function DynamicForm() {
  const [form, setForm] = useState<FormData | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { proposalId, id } = useParams()
  const router = useRouter()
  const [filledData, setFilledData] = useState<any>(null)

  // First fetch the filled form data
  useEffect(() => {
    async function fetchFilledData() {
      setIsLoading(true);
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
        console.log("Filled form data:", data);
  
        if (data && data._id) {
          setFilledData(data);
          
          // Set the form values directly from submittedData
          if (data.submittedData) {
            setFormValues(data.submittedData);
            console.log("Setting form values from submittedData:", data.submittedData);
          }
        }
      } catch (error) {
        console.error("Error fetching filled form data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (proposalId) {
      fetchFilledData();
    } else {
      setIsLoading(false);
    }
  }, [proposalId]);   

  // Then fetch the form structure
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/submit/${proposalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to save form")
      }

      router.push(`/`)
      console.log("successfully submitted form")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
        <p className="text-muted-foreground">The requested form could not be loaded.</p>
      </div>
    )
  }

  console.log("Current form values:", formValues);

  return (
    <Card className="max-w-xl mx-auto shadow-md mt-10">
      <CardHeader className="">
        <CardTitle className="text-xl">{form.name}</CardTitle>
        {filledData && (
          <div className="mt-2">
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
              <div className="ml-2 px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md inline-block">
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

              {field.key === "textfield" && (
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

              {field.key === "textarea" && (
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

              {field.key === "number" && (
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

              {field.key === "password" && (
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

              {field.placeholder &&
                field.inputType !== "password" &&
                field.type !== "checkbox" &&
                field.type !== "radio" &&
                field.type !== "select" && <p className="text-xs text-muted-foreground mt-1">{field.placeholder}</p>}
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
  )
}