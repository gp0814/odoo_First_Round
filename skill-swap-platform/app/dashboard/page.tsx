"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Eye, EyeOff, TrendingUp, Users } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { AddSkillDialog } from "@/components/skills/add-skill-dialog"
import { EditSkillDialog } from "@/components/skills/edit-skill-dialog"
import { getUserSkillsOffered, getUserSkillsWanted, deleteUserSkillOffered, deleteUserSkillWanted } from "@/lib/skills"
import { updateUserProfile } from "@/lib/auth"
import type { UserSkillOffered, UserSkillWanted } from "@/types/database"

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const [skillsOffered, setSkillsOffered] = useState<UserSkillOffered[]>([])
  const [skillsWanted, setSkillsWanted] = useState<UserSkillWanted[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      const [offered, wanted] = await Promise.all([getUserSkillsOffered(user.id), getUserSkillsWanted(user.id)])

      setSkillsOffered(offered)
      setSkillsWanted(wanted)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProfileVisibility = async () => {
    if (!user) return

    try {
      await updateUserProfile(user.id, { is_public: !user.is_public })
      await refreshUser()
    } catch (error) {
      console.error("Error updating profile visibility:", error)
      alert("Error updating profile visibility")
    }
  }

  const handleDeleteSkill = async (skillId: string, type: "offered" | "wanted") => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      if (type === "offered") {
        await deleteUserSkillOffered(skillId)
        setSkillsOffered((prev) => prev.filter((skill) => skill.id !== skillId))
      } else {
        await deleteUserSkillWanted(skillId)
        setSkillsWanted((prev) => prev.filter((skill) => skill.id !== skillId))
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
      alert("Error deleting skill")
    }
  }

  const getSkillCategoryColor = (category: string) => {
    const colors = {
      Programming: "from-blue-500 to-cyan-500",
      Design: "from-purple-500 to-pink-500",
      Language: "from-green-500 to-emerald-500",
      Music: "from-orange-500 to-red-500",
      Business: "from-indigo-500 to-purple-500",
      Creative: "from-pink-500 to-rose-500",
    }
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Expert":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your dashboard</h1>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Manage your skills and swap requests</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={toggleProfileVisibility}
              className={`flex items-center gap-2 transition-all duration-200 ${
                user.is_public
                  ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              {user.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {user.is_public ? "Public Profile" : "Private Profile"}
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="offered" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
                <TabsTrigger
                  value="offered"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  Skills I Offer
                </TabsTrigger>
                <TabsTrigger
                  value="wanted"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
                >
                  Skills I Want
                </TabsTrigger>
              </TabsList>

              <TabsContent value="offered" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Skills You Offer</h2>
                  <AddSkillDialog type="offered" onSkillAdded={loadDashboardData} />
                </div>

                <div className="grid gap-4">
                  {skillsOffered.map((skill) => (
                    <Card
                      key={skill.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSkillCategoryColor(skill.skill?.category || "")}`}
                              ></div>
                              <CardTitle className="text-lg text-gray-900">{skill.skill?.name}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getExperienceBadgeColor(skill.experience_level || "")} border`}>
                                {skill.experience_level}
                              </Badge>
                              <Badge
                                className={
                                  skill.is_approved
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                                }
                              >
                                {skill.is_approved ? "✓ Approved" : "⏳ Pending Review"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <EditSkillDialog skill={skill} type="offered" onSkillUpdated={loadDashboardData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSkill(skill.id, "offered")}
                              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {skillsOffered.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No skills offered yet. Add your first skill to get started!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="wanted" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Skills You Want to Learn</h2>
                  <AddSkillDialog type="wanted" onSkillAdded={loadDashboardData} />
                </div>

                <div className="grid gap-4">
                  {skillsWanted.map((skill) => (
                    <Card
                      key={skill.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSkillCategoryColor(skill.skill?.category || "")}`}
                              ></div>
                              <CardTitle className="text-lg text-gray-900">{skill.skill?.name}</CardTitle>
                            </div>
                            <Badge
                              className={`mt-1 ${
                                skill.urgency === "High"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : skill.urgency === "Medium"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                              } border`}
                            >
                              {skill.urgency} Priority
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <EditSkillDialog skill={skill} type="wanted" onSkillUpdated={loadDashboardData} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSkill(skill.id, "wanted")}
                              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {skillsWanted.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No learning goals yet. Add skills you want to learn!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5 text-blue-600" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{skillsOffered.length}</div>
                    <div className="text-xs text-gray-600">Skills Offered</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{skillsWanted.length}</div>
                    <div className="text-xs text-gray-600">Skills Wanted</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{user.location || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Availability</p>
                    <p className="text-sm text-gray-600">{user.availability || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <a href="/browse">Browse Skills</a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <a href="/requests">View Requests</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
