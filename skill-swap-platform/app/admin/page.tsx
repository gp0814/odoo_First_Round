"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Download,
  Ban,
  Check,
  X,
  Send,
  BarChart3,
  Shield,
  TrendingUp,
  Activity,
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  activeSwaps: number
  pendingReports: number
  completedSwaps: number
}

interface PendingSkill {
  id: string
  user_name: string
  skill_name: string
  description: string
  created_at: string
}

interface ReportedUser {
  id: string
  name: string
  email: string
  reports_count: number
  last_report: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSwaps: 0,
    pendingReports: 0,
    completedSwaps: 0,
  })
  const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([])
  const [reportedUsers, setReportedUsers] = useState<ReportedUser[]>([])
  const [messageTitle, setMessageTitle] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    // Mock data - in real app, fetch from Supabase
    setStats({
      totalUsers: 1247,
      activeSwaps: 89,
      pendingReports: 3,
      completedSwaps: 456,
    })

    setPendingSkills([
      {
        id: "1",
        user_name: "John Doe",
        skill_name: "Advanced Hacking",
        description: "I can teach you how to hack into systems",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        user_name: "Jane Smith",
        skill_name: "React Development",
        description: "Professional React development with hooks and context",
        created_at: "2024-01-14T14:30:00Z",
      },
    ])

    setReportedUsers([
      {
        id: "1",
        name: "Spam User",
        email: "spam@example.com",
        reports_count: 5,
        last_report: "2024-01-15T09:00:00Z",
      },
      {
        id: "2",
        name: "Inappropriate User",
        email: "bad@example.com",
        reports_count: 3,
        last_report: "2024-01-14T16:00:00Z",
      },
    ])

    setLoading(false)
  }

  const handleApproveSkill = async (skillId: string) => {
    setPendingSkills((prev) => prev.filter((skill) => skill.id !== skillId))
    console.log("Skill approved:", skillId)
  }

  const handleRejectSkill = async (skillId: string) => {
    setPendingSkills((prev) => prev.filter((skill) => skill.id !== skillId))
    console.log("Skill rejected:", skillId)
  }

  const handleBanUser = async (userId: string) => {
    setReportedUsers((prev) => prev.filter((user) => user.id !== userId))
    console.log("User banned:", userId)
  }

  const handleSendMessage = async () => {
    if (!messageTitle || !messageContent) return

    console.log("Platform message sent:", { title: messageTitle, content: messageContent })
    setMessageTitle("")
    setMessageContent("")
  }

  const handleDownloadReport = (reportType: string) => {
    console.log("Downloading report:", reportType)
    // In real app, generate and download CSV/PDF report
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600">Manage users, content, and platform operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs opacity-80">+12% this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Swaps</CardTitle>
              <MessageSquare className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeSwaps}</div>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="h-3 w-3" />
                <span className="text-xs opacity-80">Live now</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Pending Reports</CardTitle>
              <AlertTriangle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingReports}</div>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs opacity-80">Needs attention</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Completed Swaps</CardTitle>
              <BarChart3 className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedSwaps}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs opacity-80">All time</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Pending Skills ({pendingSkills.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Reported Users ({reportedUsers.length})
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Platform Messages
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-gray-900">Skills Pending Approval</CardTitle>
                <CardDescription>Review and moderate user-submitted skills</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pendingSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{skill.skill_name}</h4>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">by {skill.user_name}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                        <span className="text-xs text-gray-500">
                          Submitted {new Date(skill.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleApproveSkill(skill.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectSkill(skill.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                <CardTitle className="text-gray-900">Reported Users</CardTitle>
                <CardDescription>Users who have been reported for policy violations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Last Report</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800 border-red-200">{user.reports_count} reports</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(user.last_report).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleBanUser(user.id)}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white flex items-center gap-1"
                          >
                            <Ban className="h-3 w-3" />
                            Ban User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-gray-900">Send Platform Message</CardTitle>
                <CardDescription>Send announcements to all users</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Message Title</label>
                  <Input
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="e.g., Platform Maintenance Notice"
                    className="mt-1 border-0 shadow-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message Content</label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message content..."
                    className="mt-1 border-0 shadow-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageTitle || !messageContent}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-gray-900">Download Reports</CardTitle>
                <CardDescription>Generate and download platform analytics</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReport("user-activity")}
                    className="flex items-center gap-3 h-20 p-4 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">User Activity Report</div>
                      <div className="text-sm text-gray-600">Registration, login stats</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReport("swap-stats")}
                    className="flex items-center gap-3 h-20 p-4 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Swap Statistics</div>
                      <div className="text-sm text-gray-600">Completed, pending swaps</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReport("feedback-logs")}
                    className="flex items-center gap-3 h-20 p-4 border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Feedback Logs</div>
                      <div className="text-sm text-gray-600">User ratings and reviews</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReport("skill-trends")}
                    className="flex items-center gap-3 h-20 p-4 border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Skill Trends</div>
                      <div className="text-sm text-gray-600">Popular skills, categories</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
