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
import { MessageSquare } from "lucide-react"
import { createSwapRequest } from "@/lib/swaps"
import { getUserSkillsOffered } from "@/lib/skills"
import { useAuth } from "@/components/auth/auth-provider"
import type { UserSkillOffered } from "@/types/database"

interface SwapRequestDialogProps {
  providerId: string
  providerName: string
  providerSkills: Array<{
    id: string
    name: string
    skill_id: string
  }>
  onRequestSent?: () => void
}

export function SwapRequestDialog({ providerId, providerName, providerSkills, onRequestSent }: SwapRequestDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mySkills, setMySkills] = useState<UserSkillOffered[]>([])
  const [selectedMySkill, setSelectedMySkill] = useState("")
  const [selectedProviderSkill, setSelectedProviderSkill] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const loadMySkills = async () => {
    if (!user) return
    try {
      const skills = await getUserSkillsOffered(user.id)
      setMySkills(skills)
    } catch (error) {
      console.error("Error loading my skills:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadMySkills()
      setMessage(`Hi ${providerName}! I'd love to learn from you. Let's swap skills!`)
    } else {
      setSelectedMySkill("")
      setSelectedProviderSkill("")
      setMessage("")
    }
  }

  const handleSubmit = async () => {
    if (!user || !selectedMySkill || !selectedProviderSkill || !message.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await createSwapRequest(user.id, providerId, selectedMySkill, selectedProviderSkill, message)

      alert("Swap request sent successfully!")
      onRequestSent?.()
      setOpen(false)
    } catch (error) {
      console.error("Error sending swap request:", error)
      alert("Error sending swap request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Sign in to Request Swap
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Request Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
          <DialogDescription>Send a swap request to {providerName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Skill to Offer</label>
            <Select value={selectedMySkill} onValueChange={setSelectedMySkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you offer" />
              </SelectTrigger>
              <SelectContent>
                {mySkills.map((skill) => (
                  <SelectItem key={skill.skill_id} value={skill.skill_id}>
                    {skill.skill?.name} ({skill.experience_level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Skill You Want to Learn</label>
            <Select value={selectedProviderSkill} onValueChange={setSelectedProviderSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill to learn" />
              </SelectTrigger>
              <SelectContent>
                {providerSkills.map((skill) => (
                  <SelectItem key={skill.skill_id} value={skill.skill_id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
