import { create } from 'zustand'

export type ProfileData = {
  full_name: string
  username: string
  email: string
  profile_picture: string
  location: string
  timezone: string
  skills: string[]
  soft_skills: string[]
  interests: string[]
  willing_to_learn: string[]
  experience_level: string
  archetype: string
  values: string[]
  mantra: string
  bio: string
  availability: string
  preferred_collab: string
  hardware: string
  access_needs: string

  
}


type ProfileStore = {
  profile: Partial<ProfileData>
  setField: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {},
  setField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),
  resetProfile: () => set({ profile: {} }),
}))

// ✅ NEW – export this helper type for use in components
export type ProfileFieldKey = keyof Partial<ProfileData>
