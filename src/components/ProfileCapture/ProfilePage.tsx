'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { ProfileData } from '../useProfileStore'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<ProfileData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setError('User not found')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) return <p className="text-white text-center">Loading profile...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>
  if (!profile) return null

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
          <h2 className="text-xl font-semibold mb-2">Location & Timezone</h2>
          <p>{profile.location || '—'} | {profile.timezone || '—'}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Skills & Interests</h2>
          <p><strong>Tech:</strong> {profile.skills?.join(', ') || '—'}</p>
          <p><strong>Soft:</strong> {profile.soft_skills?.join(', ') || '—'}</p>
          <p><strong>Interests:</strong> {profile.interests?.join(', ') || '—'}</p>
          <p><strong>Willing to Learn:</strong> {profile.willing_to_learn?.join(', ') || '—'}</p>
          <p><strong>Experience:</strong> {profile.experience_level}</p>
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
          <h2 className="text-xl font-semibold mb-2">Availability & Access</h2>
          <p><strong>Availability:</strong> {profile.availability}</p>
          <p><strong>Collab Style:</strong> {profile.preferred_collab}</p>
          <p><strong>Hardware:</strong> {profile.hardware}</p>
          <p><strong>Access Needs:</strong> {profile.access_needs}</p>
        </section>
      </div>
    </div>
  )
}
