import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText, ImageIcon, Upload } from "lucide-react"

export const FormPreviewDialog = ({ isOpen, setIsOpen, form }) => {
  if (!form) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 gap-1">
          <Eye className="h-4 w-4" /> Preview Complete Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {form.components?.map((field, idx) => (
            <div key={idx} className="space-y-2">
              <Label className="font-medium">
                {field.label}
                {field.validate?.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "textfield" && <Input type="text" disabled placeholder={field.placeholder || ""} />}

              {field.type === "textarea" && (
                <Textarea disabled placeholder={field.placeholder || ""} className="min-h-[120px]" />
              )}

              {field.inputType === "date" && <Input type="date" disabled />}

              {field.type === "number" && <Input type="number" disabled placeholder={field.placeholder || ""} />}

              {field.type === "password" && <Input type="password" disabled placeholder="••••••" />}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2 pt-1">
                  <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
                  <Label className="text-sm font-normal">{field.placeholder || "Yes"}</Label>
                </div>
              )}

              {field.type === "radio" && (
                <div className="space-y-2 pt-1">
                  {field.options?.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2">
                      <input type="radio" disabled className="h-4 w-4 border-gray-300" />
                      <Label className="text-sm font-normal">{option}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "select" && (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                </Select>
              )}

              {field.type === "file" && (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  {field.key === "imageupload" ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-muted/40 rounded-full p-3">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {field.placeholder || `Upload ${field.label}`}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {field.multiple ? 'Drag and drop multiple images or click to browse' : 'Drag and drop an image or click to browse'}
                        </span>
                        {field.fileTypes && field.fileTypes.length > 0 && (
                          <span className="text-xs text-muted-foreground mt-1">
                            Allowed formats: {field.fileTypes.map(t => `.${t}`).join(", ")}
                          </span>
                        )}
                        {field.imageSize && (
                          <span className="text-xs text-muted-foreground">
                            Maximum size: {field.imageSize} MB
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-muted/40 rounded-full p-3">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {field.placeholder || `Upload ${field.label}`}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {field.multiple ? 'Drag and drop multiple files or click to browse' : 'Drag and drop a file or click to browse'}
                        </span>
                        {field.fileTypes && field.fileTypes.length > 0 && (
                          <span className="text-xs text-muted-foreground mt-1">
                            Allowed formats: {field.fileTypes.map(t => `.${t}`).join(", ")}
                          </span>
                        )}
                        {field.imageSize && (
                          <span className="text-xs text-muted-foreground">
                            Maximum size: {field.imageSize} MB
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <Button variant="outline" className="mt-4" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              )}

              {field.placeholder &&
                field.inputType !== "password" &&
                field.type !== "checkbox" &&
                field.type !== "radio" &&
                field.type !== "select" &&
                field.type !== "file" && (
                  <p className="text-xs text-muted-foreground mt-1">{field.placeholder}</p>
                )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}