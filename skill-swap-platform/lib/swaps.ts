import { supabase } from "./supabase"
import type { SwapRequest, Rating } from "@/types/database"

export async function createSwapRequest(
  requesterId: string,
  providerId: string,
  offeredSkillId: string,
  wantedSkillId: string,
  message: string,
): Promise<SwapRequest> {
  const { data, error } = await supabase
    .from("swap_requests")
    .insert([
      {
        requester_id: requesterId,
        provider_id: providerId,
        offered_skill_id: offeredSkillId,
        wanted_skill_id: wantedSkillId,
        message,
        status: "pending",
      },
    ])
    .select(`
      *,
      requester:users!requester_id(*),
      provider:users!provider_id(*),
      offered_skill:skills!offered_skill_id(*),
      wanted_skill:skills!wanted_skill_id(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getSwapRequestsReceived(userId: string): Promise<SwapRequest[]> {
  const { data, error } = await supabase
    .from("swap_requests")
    .select(`
      *,
      requester:users!requester_id(*),
      provider:users!provider_id(*),
      offered_skill:skills!offered_skill_id(*),
      wanted_skill:skills!wanted_skill_id(*)
    `)
    .eq("provider_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getSwapRequestsSent(userId: string): Promise<SwapRequest[]> {
  const { data, error } = await supabase
    .from("swap_requests")
    .select(`
      *,
      requester:users!requester_id(*),
      provider:users!provider_id(*),
      offered_skill:skills!offered_skill_id(*),
      wanted_skill:skills!wanted_skill_id(*)
    `)
    .eq("requester_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCompletedSwaps(userId: string): Promise<SwapRequest[]> {
  const { data, error } = await supabase
    .from("swap_requests")
    .select(`
      *,
      requester:users!requester_id(*),
      provider:users!provider_id(*),
      offered_skill:skills!offered_skill_id(*),
      wanted_skill:skills!wanted_skill_id(*)
    `)
    .eq("status", "completed")
    .or(`requester_id.eq.${userId},provider_id.eq.${userId}`)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateSwapRequestStatus(requestId: string, status: SwapRequest["status"]): Promise<SwapRequest> {
  const { data, error } = await supabase
    .from("swap_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select(`
      *,
      requester:users!requester_id(*),
      provider:users!provider_id(*),
      offered_skill:skills!offered_skill_id(*),
      wanted_skill:skills!wanted_skill_id(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function createRating(
  swapRequestId: string,
  raterId: string,
  ratedId: string,
  rating: number,
  feedback?: string,
): Promise<Rating> {
  const { data, error } = await supabase
    .from("ratings")
    .insert([
      {
        swap_request_id: swapRequestId,
        rater_id: raterId,
        rated_id: ratedId,
        rating,
        feedback,
      },
    ])
    .select(`
      *,
      rater:users!rater_id(*),
      rated:users!rated_id(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getUsersWithSkills(searchTerm?: string, category?: string) {
  let query = supabase
    .from("users")
    .select(`
      *,
      skills_offered:user_skills_offered(
        *,
        skill:skills(*)
      )
    `)
    .eq("is_public", true)
    .eq("is_banned", false)

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,skills_offered.skill.name.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query

  if (error) throw error

  let filteredData = data || []

  if (category && category !== "all") {
    filteredData = filteredData.filter((user) =>
      user.skills_offered?.some((skill: any) => skill.skill?.category === category),
    )
  }

  return filteredData
}
