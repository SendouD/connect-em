"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DndContext, useDroppable, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical, X, Plus, ChevronDown, ChevronUp, Save, Image as ImageIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner";
import FormSidebar from "./form-sidebar"

interface FormElementValidation {
  required: boolean
  minLength?: string
  maxLength?: string
  pattern?: string
  custom?: string
  customPrivate?: boolean
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

interface FormData {
  id?: string
  name: string
  components: any[]
  created?: string
  updated?: string
}

const defaultValidation = {
  required: false,
  minLength: "",
  maxLength: "",
  pattern: "",
  custom: "",
  customPrivate: false,
}

const formElements: FormElement[] = [
  { id: "textfield", label: "Text Field", type: "textfield", inputType: "text" },
  { id: "textarea", label: "Text Area", type: "textarea" },
  { id: "number", label: "Number", type: "number" },
  { id: "password", label: "Password", type: "password" },
  { id: "date", label: "Date", type: "textfield", inputType: "date" },
  { id: "radio", label: "Radio Button", type: "radio", options: ["Option 1", "Option 2"] },
  { id: "checkbox", label: "Checkbox", type: "checkbox", options: ["Option A", "Option B"] },
  { id: "select", label: "Select Box", type: "select", options: ["Choice 1", "Choice 2"] },
  { id: "file", label: "Image Upload", type: "file", key: "imageupload", fileTypes: ["jpg", "jpeg", "png", "gif"], multiple: false },
  { id: "document", label: "Document Upload", type: "file", key: "documentupload", fileTypes: ["pdf", "doc", "docx", "txt"], multiple: false },
]

const DraggableField: React.FC<FormElement> = ({ id, label }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors p-3 rounded-md cursor-move flex items-center gap-2 text-sm group"
    >
      <GripVertical className="h-4 w-4 group-hover:text-primary transition-colors" />
      {label}
    </div>
  )
}

const SortableItem: React.FC<{
  item: FormElement
  updateElement: (id: string, data: Partial<FormElement>) => void
  removeElement: (id: string) => void
}> = ({ item, updateElement, removeElement }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const [expanded, setExpanded] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-4 relative transition-all duration-200">
      <CardContent className="pt-6 pb-4">
        <div {...attributes} {...listeners} className="absolute top-2 left-2 cursor-move text-muted-foreground p-1">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex justify-between mb-4">
          <h3 className="font-medium">{item.label}</h3>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-6 px-2">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {expanded ? (
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              {item.type === "file" && <TabsTrigger value="file">File Settings</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`${item.id}-label`} className="mb-1.5">
                    Label
                  </Label>
                  <Input
                    id={`${item.id}-label`}
                    value={item.label}
                    onChange={(e) => updateElement(item.id, { label: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor={`${item.id}-key`} className="mb-1.5">
                    Property Name
                  </Label>
                  <Input
                    id={`${item.id}-key`}
                    value={item.key || ""}
                    onChange={(e) => updateElement(item.id, { key: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">The name of this field in the API endpoint</p>
                </div>

                <div>
                  <Label htmlFor={`${item.id}-placeholder`} className="mb-1.5">
                    Placeholder
                  </Label>
                  <Input
                    id={`${item.id}-placeholder`}
                    value={item.placeholder || ""}
                    onChange={(e) => updateElement(item.id, { placeholder: e.target.value })}
                  />
                </div>

                {item.type !== "file" && (
                  <div>
                    <Label htmlFor={`${item.id}-default`} className="mb-1.5">
                      Default Value
                    </Label>
                    <Input
                      id={`${item.id}-default`}
                      value={item.defaultValue || ""}
                      onChange={(e) => updateElement(item.id, { defaultValue: e.target.value })}
                    />
                  </div>
                )}

                {(item.type === "radio" || item.type === "checkbox" || item.type === "select") && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium mb-1.5">Options</Label>
                    {item.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(item.options || [])]
                            newOptions[index] = e.target.value
                            updateElement(item.id, { options: newOptions })
                          }}
                          className="flex-grow"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            updateElement(item.id, { options: item.options?.filter((_, i) => i !== index) })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateElement(item.id, {
                          options: [...(item.options || []), `Option ${item.options?.length + 1}`],
                        })
                      }
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Option
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="validation">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${item.id}-required`}>Required</Label>
                  <Switch
                    id={`${item.id}-required`}
                    checked={item.validate?.required || false}
                    onCheckedChange={(checked) => {
                      const validate = { ...(item.validate || defaultValidation), required: checked }
                      updateElement(item.id, { validate })
                    }}
                  />
                </div>

                {item.type !== "file" && (
                  <>
                    <div>
                      <Label htmlFor={`${item.id}-minLength`} className="mb-1.5">
                        Minimum Length
                      </Label>
                      <Input
                        id={`${item.id}-minLength`}
                        value={item.validate?.minLength || ""}
                        onChange={(e) => {
                          const validate = { ...(item.validate || defaultValidation), minLength: e.target.value }
                          updateElement(item.id, { validate })
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`${item.id}-maxLength`} className="mb-1.5">
                        Maximum Length
                      </Label>
                      <Input
                        id={`${item.id}-maxLength`}
                        value={item.validate?.maxLength || ""}
                        onChange={(e) => {
                          const validate = { ...(item.validate || defaultValidation), maxLength: e.target.value }
                          updateElement(item.id, { validate })
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`${item.id}-pattern`} className="mb-1.5">
                        Regular Expression Pattern
                      </Label>
                      <Input
                        id={`${item.id}-pattern`}
                        value={item.validate?.pattern || ""}
                        onChange={(e) => {
                          const validate = { ...(item.validate || defaultValidation), pattern: e.target.value }
                          updateElement(item.id, { validate })
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`${item.id}-custom`} className="mb-1.5">
                        Custom Validation
                      </Label>
                      <Textarea
                        id={`${item.id}-custom`}
                        value={item.validate?.custom || ""}
                        onChange={(e) => {
                          const validate = { ...(item.validate || defaultValidation), custom: e.target.value }
                          updateElement(item.id, { validate })
                        }}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">A custom validation JS expression</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${item.id}-customPrivate`}>Private Custom Validation</Label>
                      <Switch
                        id={`${item.id}-customPrivate`}
                        checked={item.validate?.customPrivate || false}
                        onCheckedChange={(checked) => {
                          const validate = { ...(item.validate || defaultValidation), customPrivate: checked }
                          updateElement(item.id, { validate })
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {item.type === "file" && (
              <TabsContent value="file">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`${item.id}-file-types`} className="mb-1.5">
                      Allowed File Types
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(item.fileTypes || []).map((type, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                          {type}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              updateElement(item.id, { fileTypes: item.fileTypes?.filter((_, i) => i !== index) })
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id={`${item.id}-file-type-input`}
                        placeholder="Type to add (e.g. jpg, png)"
                        className="flex-grow"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const value = input.value.trim().toLowerCase();
                            if (value && !(item.fileTypes || []).includes(value)) {
                              updateElement(item.id, {
                                fileTypes: [...(item.fileTypes || []), value]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById(`${item.id}-file-type-input`) as HTMLInputElement;
                          const value = input.value.trim().toLowerCase();
                          if (value && !(item.fileTypes || []).includes(value)) {
                            updateElement(item.id, {
                              fileTypes: [...(item.fileTypes || []), value]
                            });
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">File extensions without dots (e.g. jpg, png)</p>
                  </div>

                  <div>
                    <Label htmlFor={`${item.id}-image-size`} className="mb-1.5">
                      Maximum File Size (MB)
                    </Label>
                    <Input
                      id={`${item.id}-image-size`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.imageSize || ""}
                      onChange={(e) => updateElement(item.id, { imageSize: e.target.value })}
                      placeholder="5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Maximum file size in megabytes</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${item.id}-multiple`}>Allow Multiple Files</Label>
                    <Switch
                      id={`${item.id}-multiple`}
                      checked={item.multiple || false}
                      onCheckedChange={(checked) => {
                        updateElement(item.id, { multiple: checked })
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div>
            {item.type === "textfield" && item.inputType === "text" && (
              <Input type="text" placeholder={item.placeholder || `Enter ${item.label}`} className="mb-2" />
            )}
            {item.type === "textfield" && item.inputType === "date" && (
              <Input type="date" placeholder={item.placeholder || `Select ${item.label}`} className="mb-2" />
            )}
            {item.type === "textarea" && (
              <Textarea placeholder={item.placeholder || `Enter ${item.label}`} className="mb-2" />
            )}
            {item.type === "number" && (
              <Input type="number" placeholder={item.placeholder || "Enter number"} className="mb-2" />
            )}
            {item.type === "password" && (
              <Input type="password" placeholder={item.placeholder || "Enter password"} className="mb-2" />
            )}
            {item.type === "file" && (
              <div className="border-2 border-dashed rounded-md p-4 text-center">
                {item.key === "imageupload" ? (
                  <ImageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                ) : (
                  <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                )}
                <p className="text-sm text-muted-foreground">
                  {item.placeholder || `Upload ${item.label}`}
                  {item.fileTypes && item.fileTypes.length > 0 && (
                    <span className="block mt-1 text-xs">
                      Allowed: {item.fileTypes.map(t => `.${t}`).join(", ")}
                    </span>
                  )}
                </p>
              </div>
            )}

            {item.type === "radio" && (
              <div className="space-y-2">
                {item.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="radio" id={`${item.id}-option-${index}`} name={item.id} />
                    <Label htmlFor={`${item.id}-option-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {item.type === "checkbox" && (
              <div className="space-y-2">
                {item.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="checkbox" id={`${item.id}-option-${index}`} />
                    <Label htmlFor={`${item.id}-option-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {item.type === "select" && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={item.placeholder || `Select ${item.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {item.options?.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {!expanded && item.validate?.required && (
          <div className="text-xs text-primary mt-1 flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1.5"></span>
            Required field
          </div>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          onClick={() => removeElement(item.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

const ProposalFormBuilder = (props: { formId: string | undefined, formName: string | undefined }) => {
    const { isOver, setNodeRef } = useDroppable({ id: "form-canvas" })
    const [elements, setElements] = useState<FormElement[]>([])
    const [formName, setFormName] = useState(props.formName)
    const [isSaving, setIsSaving] = useState(false)
    let formId = props.formId

    const transformFormElements = (components: any[]): FormElement[] => {
      return components.map((component) => ({
        id: `${component.key}-${Date.now()}`,
        label: component.label || '',
        type: component.type || 'text',
        key: component.key,
        placeholder: component.placeholder,
        defaultValue: component.defaultValue,
        options: component.options,
        tableView: component.tableView,
        inputType: component.inputType,
        validate: component.validate,
        fileTypes: component.fileTypes,
        maxSize: component.maxSize,
        imageSize: component.imageSize,
      }));
    };

    useEffect(() => {
      async function fetchForms() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/proposal-form/${formId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data);


          const transformedElements = transformFormElements(data.components);
          setElements([]);

          setTimeout(() => {
              setElements(transformedElements);
              setFormName(data.name);
          }, 50);
          
        } catch (error) {
          console.error("Error fetching forms:", error);
        }
      }
  
      fetchForms();
    }, []);  

    useEffect(() => {
        console.log("Form elements:", elements);
    },[elements])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        setElements((prev) => {
        const oldIndex = prev.findIndex((ele) => ele.id === active.id)
        const newIndex = prev.findIndex((ele) => ele.id === over.id)

        if (oldIndex === -1) {
            const field = formElements.find((f) => f.id === active.id)
            if (!field) return prev

            const newField = {
            ...field,
            id: `${field.id}-${Date.now()}`,
            key: field.label.toLowerCase().replace(/\s+/g, ""),
            placeholder: "",
            defaultValue: "",
            tableView: true,
            options: field.options ? [...field.options] : undefined,
            validate: { ...defaultValidation },
            fileTypes: field.fileTypes,
            maxSize: field.maxSize,
            imageSize: field.imageSize,
            }

            return [...prev, newField]
        }

        return arrayMove(prev, oldIndex, newIndex)
        })
    }

    const updateElement = (id: string, data: Partial<FormElement>) => {
        setElements((prev) => prev.map((ele) => (ele.id === id ? { ...ele, ...data } : ele)))
    }

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((ele) => ele.id !== id))
    }

    const prepareFormData = (): FormData => {
        return {
        id: formId,
        name: "" + formName?.toString(),
        components: elements.map((ele) => ({
            input: true,
            tableView: ele.tableView !== false,
            inputType: ele.inputType || "text",
            inputMask: "",
            label: ele.label,
            key: ele.key || ele.label.toLowerCase().replace(/\s+/g, ""),
            placeholder: ele.placeholder || "",
            prefix: "",
            suffix: "",
            multiple: ele.defaultValue === "multiple",
            defaultValue: ele.defaultValue || "",
            protected: false,
            unique: false,
            persistent: true,
            validate: ele.validate || defaultValidation,
            type: ele.type,
            tags: [],
            lockKey: true,
            isNew: false,
            options: ele.options ? ele.options : [],
            fileTypes: ele.fileTypes,
            maxSize: ele.maxSize,
            imageSize: ele.imageSize,
        })),
        }
    }

    const exportJSON = () => {
        const formData = prepareFormData()
        const dataStr = JSON.stringify(formData, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportFileDefaultName = `${formName?.toLowerCase().replace(/\s+/g, "-")}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
    }

    const saveFormToDatabase = async () => {
        try {
            setIsSaving(true)
            const formData = prepareFormData()
            console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/proposal-form`, {
                method: formId ? 'PUT' : 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Failed to save form')
            }

            const savedForm = await response.json()
            formId = savedForm._id

            toast.success(`Form ${formId ? 'updated' : 'saved'} successfully`);
        } catch (error) {
            console.error('Error saving form:', error)
            toast.error("Failed to save form to database");
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex h-screen">

            <div className="flex-1 p-4 bg-background">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="p-4 bg-background">
                        <div className="flex justify-between items-center mb-6 bg-card p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4 w-1/2">
                            <Label htmlFor="form-name" className="whitespace-nowrap font-medium">
                            Form Name:
                            </Label>
                            <Input
                            id="form-name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="flex-grow"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="default" 
                                onClick={saveFormToDatabase} 
                                disabled={isSaving}
                                className="flex items-center gap-2"
                            >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'Saving...' : (formId ? 'Update Form' : 'Save to Database')}
                            </Button>
                            <Button variant="outline" onClick={exportJSON} className="flex items-center gap-2">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                            >
                                <path
                                d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5539 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1046 12.1049 14 11.0012 14H3.99635C2.89178 14 2 12.1046 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                ></path>
                            </svg>
                            Export JSON
                            </Button>
                        </div>
                        </div>

                        <div className="flex gap-6">
                        <Card className="w-1/4 p-4 h-fit sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
                            <p className="text-sm text-muted-foreground mb-4">Drag and drop elements onto the form builder</p>
                            <div className="space-y-1">
                            {formElements.map((item) => (
                                <DraggableField key={item.id} {...item} />
                            ))}
                            </div>
                        </Card>

                        <div
                            ref={setNodeRef}
                            className={`w-3/4 min-h-[600px] border-2 border-dashed rounded-lg p-6 transition-colors ${
                            isOver ? "bg-muted/70" : "bg-background"
                            }`}
                        >
                            <h2 className="text-lg font-semibold mb-4">Form Builder</h2>
                            <SortableContext items={elements.map((ele) => ele.id)} strategy={rectSortingStrategy}>
                            {elements.map((item) => (
                                <SortableItem key={item.id} item={item} updateElement={updateElement} removeElement={removeElement} />
                            ))}
                            </SortableContext>
                            {elements.length === 0 && (
                            <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center">
                                <Plus className="h-12 w-12 mb-2 opacity-20" />
                                <p>Drag and drop form elements here</p>
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                </DndContext>    
            </div>
        </div>


    )
}

export default ProposalFormBuilder