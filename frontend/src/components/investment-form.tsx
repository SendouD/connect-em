"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

const domainOptions = ["Software Development", "Hardware", "IT Infrastructure", "Research & Development"]

const typeOptions = {
  "Software Development": ["Web Development", "Mobile Apps", "Blockchain", "AI/ML", "Cloud Services"],
  Hardware: ["IoT Devices", "Computing Hardware", "Network Equipment", "Custom Hardware"],
  "IT Infrastructure": ["Data Centers", "Cloud Infrastructure", "Security Systems", "Network Infrastructure"],
  "Research & Development": ["Basic Research", "Applied Research", "Prototyping", "Innovation Labs"],
}

export const InvestmentForm = ({ proposalData, setProposalData }) => {
  const addInvestment = () => {
    setProposalData({
      ...proposalData,
      investments: [...proposalData.investments, { domain: "", type: "", amount: "" }],
    })
  }

  const removeInvestment = (index) => {
    const updatedInvestments = [...proposalData.investments]
    updatedInvestments.splice(index, 1)
    setProposalData({
      ...proposalData,
      investments: updatedInvestments,
    })
  }

  const updateInvestment = (index, field, value) => {
    const updatedInvestments = [...proposalData.investments]
    updatedInvestments[index] = {
      ...updatedInvestments[index],
      [field]: value,
    }

    if (field === "domain") {
      updatedInvestments[index].type = ""
    }

    setProposalData({
      ...proposalData,
      investments: updatedInvestments,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Specify Investment Domains</h3>
        <p className="text-muted-foreground mb-4">
          Indicate how much you want to invest in each domain and technology type.
        </p>
      </div>

      {proposalData.investments.map((investment, index) => (
        <Card key={index} className="p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`domain-${index}`}>Domain</Label>
              <Select value={investment.domain} onValueChange={(value) => updateInvestment(index, "domain", value)}>
                <SelectTrigger id={`domain-${index}`}>
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

            <div className="space-y-2">
              <Label htmlFor={`type-${index}`}>Type</Label>
              <Select
                value={investment.type}
                onValueChange={(value) => updateInvestment(index, "type", value)}
                disabled={!investment.domain}
              >
                <SelectTrigger id={`type-${index}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {investment.domain &&
                    typeOptions[investment.domain].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`amount-${index}`}>Investment Amount ($)</Label>
              <Input
                id={`amount-${index}`}
                type="number"
                placeholder="Enter amount"
                value={investment.amount}
                onChange={(e) => updateInvestment(index, "amount", e.target.value)}
              />
            </div>
          </div>

          {proposalData.investments.length > 1 && (
            <Button variant="outline" className="mt-4" size="sm" onClick={() => removeInvestment(index)}>
              Remove
            </Button>
          )}
        </Card>
      ))}

      <Button variant="outline" onClick={addInvestment} className="w-full">
        <PlusCircle className="h-4 w-4 mr-2" /> Add Another Investment
      </Button>
    </div>
  )
}

