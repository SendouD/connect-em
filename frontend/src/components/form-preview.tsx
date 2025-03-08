import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ImageIcon } from "lucide-react"

export const FormPreview = ({ form }) => {
  if (!form) return null
  return (
    <div className="p-4 border rounded-md bg-muted/50 space-y-4">
      <h3 className="font-medium text-base">{form.name} - Preview</h3>
      <div className="space-y-4">
        {form.components?.map((field, idx) => (
          <div key={idx} className="space-y-2">
            <Label className="text-sm">
              {field.label}
              {field.validate?.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === "textfield" && (
              <Input type="text" disabled placeholder={field.placeholder || ""} className="bg-background/50" />
            )}
            {field.type === "textarea" && (
              <Textarea disabled placeholder={field.placeholder || ""} className="bg-background/50 h-20" />
            )}
            {field.inputType === "date" && <Input type="date" disabled className="bg-background/50" />}
            {field.type === "number" && (
              <Input type="number" disabled placeholder={field.placeholder || ""} className="bg-background/50" />
            )}
            {field.type === "password" && (
              <Input type="password" disabled placeholder="••••••" className="bg-background/50" />
            )}
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
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
              </Select>
            )}
            {field.type === "file" && (
              <div className="border-2 border-dashed rounded-md p-3 text-center bg-background/50">
                {field.key === "imageupload" ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <ImageIcon className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">
                      {field.placeholder || `Upload ${field.label}`}
                    </span>
                    {field.fileTypes && field.fileTypes.length > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        Allowed: {field.fileTypes.map(t => `.${t}`).join(", ")}
                      </span>
                    )}
                    {field.imageSize && (
                      <span className="text-xs text-muted-foreground">
                        Max size: {field.imageSize} MB
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2">
                    <FileText className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">
                      {field.placeholder || `Upload ${field.label}`}
                    </span>
                    {field.fileTypes && field.fileTypes.length > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        Allowed: {field.fileTypes.map(t => `.${t}`).join(", ")}
                      </span>
                    )}
                    {field.imageSize && (
                      <span className="text-xs text-muted-foreground">
                        Max size: {field.imageSize} MB
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}