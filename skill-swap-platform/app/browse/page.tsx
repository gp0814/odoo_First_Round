"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Zap, Filter } from "lucide-react"
import { SwapRequestDialog } from "@/components/swaps/swap-request-dialog"
import { getUsersWithSkills } from "@/lib/swaps"

interface UserWithSkills {
  id: string
  name: string
  location?: string
  availability?: string
  profile_photo_url?: string
  skills_offered: Array<{
    id: string
    skill_id: string
    description: string
    experience_level: string
    skill: {
      id: string
      name: string
      category: string
    }
  }>
}

export default function BrowsePage() {
  const [users, setUsers] = useState<UserWithSkills[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithSkills[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, categoryFilter, users])

  const loadUsers = async () => {
    try {
      const usersData = await getUsersWithSkills()
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = async () => {
    try {
      const filtered = await getUsersWithSkills(searchTerm, categoryFilter)
      setFilteredUsers(filtered)
    } catch (error) {
      console.error("Error filtering users:", error)
    }
  }

  const categories = ["Programming", "Design", "Language", "Music", "Office", "Business", "Creative"]

  const getSkillCategoryColor = (category: string) => {
    const colors = {
      Programming: "from-blue-500 to-cyan-500",
      Design: "from-purple-500 to-pink-500",
      Language: "from-green-500 to-emerald-500",
      Music: "from-orange-500 to-red-500",
      Business: "from-indigo-500 to-purple-500",
      Creative: "from-pink-500 to-rose-500",
      Office: "from-gray-500 to-slate-500",
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
      case "Native":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Browse Skills 🔍
          </h1>
          <p className="text-gray-600">Find people with the skills you need</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by skill or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0 shadow-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48 border-0 shadow-lg bg-white">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                      <AvatarImage src={user.profile_photo_url || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{user.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            {user.location}
                          </div>
                        )}
                        {user.availability && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-green-500" />
                            {user.availability}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <SwapRequestDialog
                    providerId={user.id}
                    providerName={user.name}
                    providerSkills={user.skills_offered.map((skill) => ({
                      id: skill.id,
                      name: skill.skill.name,
                      skill_id: skill.skill.id,
                    }))}
                    onRequestSent={() => {
                      // Optionally refresh data or show success message
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Skills Offered:
                    </h4>
                    <div className="grid gap-3">
                      {user.skills_offered.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-start justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-4 h-4 rounded-full bg-gradient-to-r ${getSkillCategoryColor(skill.skill.category)} shadow-sm`}
                              ></div>
                              <span className="font-semibold text-gray-900">{skill.skill.name}</span>
                              <Badge className={`${getExperienceBadgeColor(skill.experience_level)} border`}>
                                {skill.experience_level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {skill.skill.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">{skill.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No users found matching your search criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
