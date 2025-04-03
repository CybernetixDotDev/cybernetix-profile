// components/dashboard/ProfileCompleteness.tsx
'use client'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { ProfileData } from '@/components/onboarding/useProfileStore'

type Props = {
    profile: Partial<ProfileData>
    onCompleteProfileClick: () => void
  }

const essentialFields = [
  'full_name',
  'username',
  'email',
  'skills',
  'experience_level',
  'archetype',
  'bio',
] as const

type EssentialField = (typeof essentialFields)[number]

export default function ProfileCompleteness({
  profile,
  onCompleteProfileClick,
}: Props) {
  const [missingFields, setMissingFields] = useState<EssentialField[]>([])
  const [hasCelebrated, setHasCelebrated] = useState(false)

  useEffect(() => {
    const missing = essentialFields.filter(
      (field) => !profile[field] || (Array.isArray(profile[field]) && profile[field]?.length === 0)
    )
    setMissingFields(missing)
  }, [profile])

  const completeness = Math.round(
    ((essentialFields.length - missingFields.length) / essentialFields.length) * 100
  )

  const showConfetti = completeness === 100 && !hasCelebrated

  useEffect(() => {
    if (showConfetti) {
      setHasCelebrated(true)
    }
  }, [showConfetti])

  return (
    <div className="bg-gradient-to-r from-purple-900 via-pink-700 to-purple-900 p-6 rounded-2xl shadow-lg relative overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-2">🌸 Cosmic Profile Progress</h2>

      <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completeness}%` }}
          className="h-full bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 rounded-full shadow-md"
        />
      </div>

      <p className="text-sm text-zinc-300 mt-2">
        Your profile is{' '}
        <span className="text-white font-semibold">{completeness}%</span> complete.
        {completeness === 100 ? ' ✨ You’re radiant!' : ''}
      </p>

      {completeness === 100 && (
        <div className="text-xs text-yellow-400 font-semibold mt-1 animate-pulse">
          💎 +50 XP for completing your profile!
        </div>
      )}

      {missingFields.length > 0 && (
        <div className="mt-4 text-sm text-zinc-200">
          <p className="mb-1">✨ You could complete:</p>
          <ul className="list-disc list-inside space-y-1">
            {missingFields.map((field) => (
              <li key={field} className="capitalize">
                {field.replace('_', ' ')}
              </li>
            ))}
          </ul>

          <button
  onClick={onCompleteProfileClick}
  className="inline-block mt-4 text-sm bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-100"
>
  Complete My Profile
</button>
        </div>
      )}
    </div>
  )
}
