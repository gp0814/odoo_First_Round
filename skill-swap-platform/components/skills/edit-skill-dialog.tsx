"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { updateUserSkillOffered, updateUserSkillWanted } from "@/lib/skills"
import type { UserSkillOffered, UserSkillWanted } from "@/types/database"

interface EditSkillDialogProps {
  skill: UserSkillOffered | UserSkillWanted
  type: "offered" | "wanted"
  onSkillUpdated: () => void
}

export function EditSkillDialog({ skill, type, onSkillUpdated }: EditSkillDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(skill.description || "")
  const [experienceLevel, setExperienceLevel] = useState(
    "experience_level" in skill ? skill.experience_level || "" : "",
  )
  const [urgency, setUrgency] = useState("urgency" in skill ? skill.urgency || "" : "")
  const [loading, setLoading] = useState(false)

  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]
  const urgencyLevels = ["Low", "Medium", "High"]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (type === "offered") {
        await updateUserSkillOffered(skill.id, {
          description,
          experience_level: experienceLevel,
        })
      } else {
        await updateUserSkillWanted(skill.id, {
          description,
          urgency,
        })
      }

      onSkillUpdated()
      setOpen(false)
    } catch (error) {
      console.error("Error updating skill:", error)
      alert("Error updating skill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 bg-transparent"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {skill.skill?.name}</DialogTitle>
          <DialogDescription>
            Update your {type === "offered" ? "skill offering" : "learning request"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder={`Describe your ${type === "offered" ? "expertise" : "learning goals"}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {type === "offered" ? (
            <div>
              <label className="text-sm font-medium">Experience Level</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Urgency</label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Updating..." : "Update Skill"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
