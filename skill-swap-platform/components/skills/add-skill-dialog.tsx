"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus } from "lucide-react"
import { getAllSkills, createSkill, addUserSkillOffered, addUserSkillWanted } from "@/lib/skills"
import { useAuth } from "@/components/auth/auth-provider"
import type { Skill } from "@/types/database"

interface AddSkillDialogProps {
  type: "offered" | "wanted"
  onSkillAdded: () => void
}

export function AddSkillDialog({ type, onSkillAdded }: AddSkillDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState("")
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("")
  const [description, setDescription] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [urgency, setUrgency] = useState("")
  const [loading, setLoading] = useState(false)
  const [showNewSkillForm, setShowNewSkillForm] = useState(false)

  const categories = ["Programming", "Design", "Language", "Music", "Office", "Business", "Creative"]
  const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]
  const urgencyLevels = ["Low", "Medium", "High"]

  const loadSkills = async () => {
    try {
      const allSkills = await getAllSkills()
      setSkills(allSkills)
    } catch (error) {
      console.error("Error loading skills:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadSkills()
    } else {
      // Reset form
      setSelectedSkillId("")
      setNewSkillName("")
      setNewSkillCategory("")
      setDescription("")
      setExperienceLevel("")
      setUrgency("")
      setShowNewSkillForm(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      let skillId = selectedSkillId

      // Create new skill if needed
      if (showNewSkillForm && newSkillName && newSkillCategory) {
        const newSkill = await createSkill(newSkillName, newSkillCategory)
        skillId = newSkill.id
      }

      if (!skillId || !description) {
        alert("Please fill in all required fields")
        return
      }

      if (type === "offered") {
        if (!experienceLevel) {
          alert("Please select an experience level")
          return
        }
        await addUserSkillOffered(user.id, skillId, description, experienceLevel)
      } else {
        if (!urgency) {
          alert("Please select an urgency level")
          return
        }
        await addUserSkillWanted(user.id, skillId, description, urgency)
      }

      onSkillAdded()
      setOpen(false)
    } catch (error) {
      console.error("Error adding skill:", error)
      alert("Error adding skill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={`flex items-center gap-2 ${
            type === "offered"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {type === "offered" ? "Skill You Offer" : "Skill You Want"}</DialogTitle>
          <DialogDescription>
            {type === "offered" ? "Add a skill you can teach to others" : "Add a skill you want to learn"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Skill</label>
            {!showNewSkillForm ? (
              <div className="space-y-2">
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewSkillForm(true)}
                  className="w-full"
                >
                  + Create New Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewSkillForm(false)}
                  className="w-full"
                >
                  Choose Existing Skill
                </Button>
              </div>
            )}
          </div>

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
              {loading ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
