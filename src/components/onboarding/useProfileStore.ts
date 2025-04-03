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

// ✅ Required fields for completeness check
const REQUIRED_FIELDS: (keyof ProfileData)[] = [
  'full_name',
  'username',
  'email',
  'profile_picture',
  'skills',
  'experience_level',
  'archetype',
  'mantra',
  'bio',
]

// ✅ Completeness checker function
export function getProfileCompleteness(profile: Partial<ProfileData>) {
  let filled = 0

  for (const field of REQUIRED_FIELDS) {
    const value = profile[field]

    if (Array.isArray(value)) {
      if (value.length > 0) filled++
    } else if (typeof value === 'string') {
      if (value.trim() !== '') filled++
    } else if (value !== undefined && value !== null) {
      filled++
    }
  }

  const percent = Math.round((filled / REQUIRED_FIELDS.length) * 100)

  return {
    percent,
    missingFields: REQUIRED_FIELDS.filter(field => {
      const value = profile[field]
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      )
    }),
  }
}
