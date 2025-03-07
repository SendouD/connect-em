"use client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PlusCircle, Loader2 } from "lucide-react"
import { FormPreview } from "./form-preview"
import { FormPreviewDialog } from "./form-preview-dialog"

export const FormSelection = ({
  proposalData,
  setProposalData,
  forms,
  isLoadingForms,
  handleFormSelection,
  handleFormNameChange,
  fetchFormDetails,
  selectedForm,
  isLoadingPreview,
  isPreviewOpen,
  setIsPreviewOpen,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select or Create Form</h3>
        <p className="text-muted-foreground mb-4">Choose an existing form or create a new one for your proposal.</p>
      </div>

      <Tabs defaultValue="existing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="existing"
            onClick={() => {
              const firstFormId = forms.length > 0 ? forms[0]._id : ""
              handleFormSelection(proposalData.formId || firstFormId)
            }}
          >
            Use Existing Form
          </TabsTrigger>
          <TabsTrigger value="new" onClick={() => handleFormSelection("new")}>
            Create New Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="py-4">
          {isLoadingForms ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="form-select" className="mb-1">
                  Select a Form
                </Label>
                <Select
                  value={proposalData.formId}
                  onValueChange={(value) => {
                    setProposalData({
                      ...proposalData,
                      selectedForm: value,
                      formId: value,
                    })
                    fetchFormDetails(value)
                  }}
                >
                  <SelectTrigger id="form-select">
                    <SelectValue placeholder="Select a form" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form._id} value={form._id}>
                        {form.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {proposalData.formId && (
                <Card className="p-4 border">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{forms.find((f) => f._id === proposalData.formId)?.name || ""}</p>
                      <p className="text-sm text-muted-foreground">Form ID: {proposalData.formId}</p>
                    </div>
                  </div>

                  {isLoadingPreview ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {selectedForm && (
                        <>
                          <FormPreview form={selectedForm} />
                          <FormPreviewDialog isOpen={isPreviewOpen} setIsOpen={setIsPreviewOpen} form={selectedForm} />
                        </>
                      )}
                    </>
                  )}
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                placeholder="Enter form name"
                value={proposalData.formName}
                onChange={handleFormNameChange}
              />
            </div>

            <Card className="p-4 border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                <p className="font-medium">Create New Custom Form</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                When you click "Submit Proposal" below, you'll be taken to the form builder to design your custom form.
                After completing the form design, your proposal will be submitted.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

