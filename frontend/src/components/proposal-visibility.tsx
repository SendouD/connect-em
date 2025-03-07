"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const ProposalVisibility = ({ isPublic, handlePublicToggle }) => {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label>Proposal Visibility</Label>
        <RadioGroup
          defaultValue="public"
          value={isPublic ? "public" : "private"}
          onValueChange={handlePublicToggle}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private</Label>
          </div>
        </RadioGroup>
      </div>

      <p className="text-sm text-muted-foreground">
        {isPublic
          ? "Public proposals will be visible to all users"
          : "Private proposals will only be visible to you and authorized users"}
      </p>
    </div>
  )
}

