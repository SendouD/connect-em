import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Form {
  _id: string
  name: string
  components: any[]
}

interface FormElement {
  id: string
  label: string
  type: string
  key?: string
  placeholder?: string
  defaultValue?: string
  options?: string[]
  tableView?: boolean
  inputType?: string
  validate?: FormElementValidation
  imageSize?: string
  fileTypes?: string[]
  multiple?: boolean
}

interface FormElementValidation {
  required?: boolean
  minLength?: string
  maxLength?: string
  pattern?: string
  custom?: string
  customPrivate?: boolean
}

interface FormSidebarProps {
  setElements: React.Dispatch<React.SetStateAction<FormElement[]>>
  setFormName: React.Dispatch<React.SetStateAction<string>>
  setFormId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function FormSidebar({ setElements, setFormName, setFormId }: FormSidebarProps) {
  const [forms, setForms] = useState<Form[]>([])
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/get-all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch forms")
      }

      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast.error("Failed to load forms")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const transformFormElements = (components: any[]): FormElement[] => {
    return components.map((component, index) => ({
      id: `${component.label}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      label: component.label || "",
      type: component.type || "textfield",
      key: component.key,
      placeholder: component.placeholder || "",
      defaultValue: component.defaultValue || "",
      // Create deep copies of arrays to avoid reference issues
      options: component.options ? [...component.options] : [],
      tableView: component.tableView !== false,
      inputType: component.inputType || "text",
      validate: component.validate ? { ...component.validate } : {
        required: false,
        minLength: "",
        maxLength: "",
        pattern: "",
        custom: "",
        customPrivate: false,
      },
      imageSize: component.fileMaxSize || "",
      // Create deep copies of arrays to avoid reference issues
      fileTypes: component.fileTypes ? [...component.fileTypes] : [],
      multiple: component.multiple || false,
    }))
  }

  const handleSelectForm = (form: Form) => {
    try {
      const transformedElements = transformFormElements(form.components)
      setElements([])

      setTimeout(() => {
        setElements(transformedElements)
        setFormName(form.name)
        setFormId(form._id)
        setSelectedForm(form._id)
        toast.success(`Loaded form: ${form.name}`)
      }, 50)
    } catch (error) {
      console.error("Error loading form:", error)
      toast.error("Failed to load form")
    }
  }

  const handleCreateNewForm = () => {
    setElements([])
    setFormName("New Form")
    setFormId(undefined)
    setSelectedForm(null)
  }

  return (
    <Card className="w-64 h-[95vh] border rounded-sm">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Forms</h2>
          <Button variant="ghost" size="icon" onClick={fetchForms} disabled={isLoading} title="Refresh forms">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {forms.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            {isLoading ? "Loading forms..." : "No forms found"}
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-2">
              {forms.map((form) => (
                <div
                  key={form._id}
                  onClick={() => handleSelectForm(form)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedForm === form._id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                  }`}
                >
                  <div className="font-medium truncate">{form.name}</div>
                  <div className="text-xs opacity-70 truncate">
                    {form.components.length} {form.components.length === 1 ? "component" : "components"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <Button className="mt-4 w-full" onClick={handleCreateNewForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Form
        </Button>
      </CardContent>
    </Card>
  )
}