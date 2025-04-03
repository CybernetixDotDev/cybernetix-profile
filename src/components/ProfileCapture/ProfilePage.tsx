// components/ProfileCapture/ProfilePage.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'
import type { ProfileData } from '@/components/onboarding/useProfileStore'
import CosmicLoader from '../ui/CosmicLoader' // (optional cute loader if you have it)

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Partial<ProfileData> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [session?.user?.id, status])

  if (status === 'loading' || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CosmicLoader /> {/* Swap with a spinner or shimmer if needed */}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">⚠ {error}</p>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-6">
        <div className="flex items-center gap-4">
          {profile.profile_picture && (
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-white"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <p className="text-sm text-gray-400">@{profile.username}</p>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
        </div>

        <hr className="border-gray-700" />

        <section>
          <h2 className="text-xl font-semibold mb-2">Skills & Interests</h2>
          <p><strong>Tech:</strong> {profile.skills?.join(', ') || '—'}</p>
          <p><strong>Soft:</strong> {profile.soft_skills?.join(', ') || '—'}</p>
          <p><strong>Interests:</strong> {profile.interests?.join(', ') || '—'}</p>
          <p><strong>Willing to Learn:</strong> {profile.willing_to_learn?.join(', ') || '—'}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Cosmic Alignment</h2>
          <p><strong>Archetype:</strong> {profile.archetype}</p>
          <p><strong>Values:</strong> {profile.values?.join(', ') || '—'}</p>
          {profile.mantra && (
            <blockquote className="italic text-yellow-400 mt-2 border-l-4 border-yellow-400 pl-4">
              “{profile.mantra}”
            </blockquote>
          )}
          <p className="mt-2">{profile.bio}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Access & Availability</h2>
          <p><strong>Availability:</strong> {profile.availability}</p>
          <p><strong>Collab Style:</strong> {profile.preferred_collab}</p>
          <p><strong>Hardware:</strong> {profile.hardware}</p>
          <p><strong>Access Needs:</strong> {profile.access_needs}</p>
        </section>
      </div>
    </div>
  )
}
