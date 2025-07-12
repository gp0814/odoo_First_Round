import { supabase } from "./supabase"
import type { Skill, UserSkillOffered, UserSkillWanted } from "@/types/database"

export async function getAllSkills(): Promise<Skill[]> {
  const { data, error } = await supabase.from("skills").select("*").order("name")

  if (error) throw error
  return data || []
}

export async function createSkill(name: string, category: string): Promise<Skill> {
  const { data, error } = await supabase.from("skills").insert([{ name, category }]).select().single()

  if (error) throw error
  return data
}

export async function getUserSkillsOffered(userId: string): Promise<UserSkillOffered[]> {
  const { data, error } = await supabase
    .from("user_skills_offered")
    .select(`
      *,
      skill:skills(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUserSkillsWanted(userId: string): Promise<UserSkillWanted[]> {
  const { data, error } = await supabase
    .from("user_skills_wanted")
    .select(`
      *,
      skill:skills(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function addUserSkillOffered(
  userId: string,
  skillId: string,
  description: string,
  experienceLevel: string,
): Promise<UserSkillOffered> {
  const { data, error } = await supabase
    .from("user_skills_offered")
    .insert([
      {
        user_id: userId,
        skill_id: skillId,
        description,
        experience_level: experienceLevel,
        is_approved: true, // Auto-approve for now
      },
    ])
    .select(`
      *,
      skill:skills(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function addUserSkillWanted(
  userId: string,
  skillId: string,
  description: string,
  urgency: string,
): Promise<UserSkillWanted> {
  const { data, error } = await supabase
    .from("user_skills_wanted")
    .insert([
      {
        user_id: userId,
        skill_id: skillId,
        description,
        urgency,
      },
    ])
    .select(`
      *,
      skill:skills(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteUserSkillOffered(skillId: string): Promise<void> {
  const { error } = await supabase.from("user_skills_offered").delete().eq("id", skillId)

  if (error) throw error
}

export async function deleteUserSkillWanted(skillId: string): Promise<void> {
  const { error } = await supabase.from("user_skills_wanted").delete().eq("id", skillId)

  if (error) throw error
}

export async function updateUserSkillOffered(
  skillId: string,
  updates: Partial<UserSkillOffered>,
): Promise<UserSkillOffered> {
  const { data, error } = await supabase
    .from("user_skills_offered")
    .update(updates)
    .eq("id", skillId)
    .select(`
      *,
      skill:skills(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateUserSkillWanted(
  skillId: string,
  updates: Partial<UserSkillWanted>,
): Promise<UserSkillWanted> {
  const { data, error } = await supabase
    .from("user_skills_wanted")
    .update(updates)
    .eq("id", skillId)
    .select(`
      *,
      skill:skills(*)
    `)
    .single()

  if (error) throw error
  return data
}
