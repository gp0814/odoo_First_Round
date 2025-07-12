"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Star, Trash2, MessageSquare, Clock, Award, Send, Heart } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  getSwapRequestsReceived,
  getSwapRequestsSent,
  getCompletedSwaps,
  updateSwapRequestStatus,
  createRating,
} from "@/lib/swaps"
import type { SwapRequest } from "@/types/database"

export default function RequestsPage() {
  const { user } = useAuth()
  const [sentRequests, setSentRequests] = useState<SwapRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<SwapRequest[]>([])
  const [completedSwaps, setCompletedSwaps] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingDialog, setRatingDialog] = useState<{ open: boolean; swapId: string | null }>({
    open: false,
    swapId: null,
  })
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (user) {
      loadRequests()
    }
  }, [user])

  const loadRequests = async () => {
    if (!user) return

    try {
      const [sent, received, completed] = await Promise.all([
        getSwapRequestsSent(user.id),
        getSwapRequestsReceived(user.id),
        getCompletedSwaps(user.id),
      ])

      setSentRequests(sent)
      setReceivedRequests(received)
      setCompletedSwaps(completed)
    } catch (error) {
      console.error("Error loading requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await updateSwapRequestStatus(requestId, "accepted")
      await loadRequests()
    } catch (error) {
      console.error("Error accepting request:", error)
      alert("Error accepting request")
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateSwapRequestStatus(requestId, "rejected")
      await loadRequests()
    } catch (error) {
      console.error("Error rejecting request:", error)
      alert("Error rejecting request")
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    try {
      await updateSwapRequestStatus(requestId, "cancelled")
      await loadRequests()
    } catch (error) {
      console.error("Error cancelling request:", error)
      alert("Error cancelling request")
    }
  }

  const handleSubmitRating = async () => {
    if (!user || !ratingDialog.swapId) return

    try {
      const swap = completedSwaps.find((s) => s.id === ratingDialog.swapId)
      if (!swap) return

      const ratedUserId = swap.requester_id === user.id ? swap.provider_id : swap.requester_id

      await createRating(ratingDialog.swapId, user.id, ratedUserId, rating, feedback)

      alert("Rating submitted successfully!")
      setRatingDialog({ open: false, swapId: null })
      setRating(5)
      setFeedback("")
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Error submitting rating")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">⏳ Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Rejected</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎉 Completed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⚪ Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your requests</h1>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Swap Requests 💬
          </h1>
          <p className="text-gray-600">Manage your skill swap requests and offers</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg">
            <TabsTrigger
              value="received"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Received ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Sent ({sentRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Completed ({completedSwaps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            <div className="grid gap-4">
              {receivedRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                          <AvatarImage
                            src={request.requester?.profile_photo_url || "/placeholder.svg"}
                            alt={request.requester?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
                            {request.requester?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{request.requester?.name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            Wants to learn{" "}
                            <span className="font-semibold text-blue-600">{request.wanted_skill?.name}</span> in
                            exchange for{" "}
                            <span className="font-semibold text-green-600">{request.offered_skill?.name}</span>
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Check className="h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {receivedRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No requests received yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            <div className="grid gap-4">
              {sentRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                          <AvatarImage
                            src={request.provider?.profile_photo_url || "/placeholder.svg"}
                            alt={request.provider?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold">
                            {request.provider?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-gray-900">To: {request.provider?.name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            You offered{" "}
                            <span className="font-semibold text-green-600">{request.offered_skill?.name}</span> for{" "}
                            <span className="font-semibold text-blue-600">{request.wanted_skill?.name}</span>
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelRequest(request.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Cancel
                          </Button>
                        )}
                        {request.status === "accepted" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sentRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No requests sent yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedSwaps.map((swap) => (
                <Card
                  key={swap.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                          <AvatarImage
                            src={
                              (swap.requester_id === user.id
                                ? swap.provider?.profile_photo_url
                                : swap.requester?.profile_photo_url) || "/placeholder.svg"
                            }
                            alt={swap.requester_id === user.id ? swap.provider?.name : swap.requester?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                            {(swap.requester_id === user.id ? swap.provider?.name : swap.requester?.name)?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            Swap with {swap.requester_id === user.id ? swap.provider?.name : swap.requester?.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            <span className="font-semibold text-green-600">{swap.offered_skill?.name}</span> ↔{" "}
                            <span className="font-semibold text-blue-600">{swap.wanted_skill?.name}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎉 Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">"{swap.message}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Award className="h-3 w-3 text-purple-500" />
                        Completed on {new Date(swap.updated_at).toLocaleDateString()}
                      </div>
                      <Dialog
                        open={ratingDialog.open && ratingDialog.swapId === swap.id}
                        onOpenChange={(open) => setRatingDialog({ open, swapId: open ? swap.id : null })}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Star className="h-3 w-3" />
                            Rate Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              Rate Your Experience
                            </DialogTitle>
                            <DialogDescription>
                              How was your skill swap with{" "}
                              {swap.requester_id === user.id ? swap.provider?.name : swap.requester?.name}?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Rating</label>
                              <div className="flex gap-1 mt-2 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-all duration-200 hover:scale-110 ${
                                      star <= rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                  >
                                    <Star className="h-8 w-8 fill-current" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Feedback (Optional)</label>
                              <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your experience..."
                                className="mt-1 border-0 shadow-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2 justify-end pt-4">
                              <Button variant="outline" onClick={() => setRatingDialog({ open: false, swapId: null })}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSubmitRating}
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-1"
                              >
                                <Send className="h-3 w-3" />
                                Submit Rating
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {completedSwaps.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No completed swaps yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
