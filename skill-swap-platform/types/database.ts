export interface User {
  id: string
  email: string
  name: string
  location?: string
  profile_photo_url?: string
  availability?: string
  is_public: boolean
  is_admin: boolean
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category?: string
  created_at: string
}

export interface UserSkillOffered {
  id: string
  user_id: string
  skill_id: string
  description?: string
  experience_level?: string
  is_approved: boolean
  created_at: string
  skill?: Skill
}

export interface UserSkillWanted {
  id: string
  user_id: string
  skill_id: string
  description?: string
  urgency?: string
  created_at: string
  skill?: Skill
}

export interface SwapRequest {
  id: string
  requester_id: string
  provider_id: string
  offered_skill_id: string
  wanted_skill_id: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  requester?: User
  provider?: User
  offered_skill?: Skill
  wanted_skill?: Skill
}

export interface Rating {
  id: string
  swap_request_id: string
  rater_id: string
  rated_id: string
  rating: number
  feedback?: string
  created_at: string
  rater?: User
  rated?: User
}
