'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { slugifyUsername } from '@/utils/slugify'
import { useProfileStore } from '@/components/useProfileStore'

const BASE_S3_URL = 'https://tzuzzjxocpuintdjxjqr.supabase.co/storage/v1/object/public/avatars'

// Define your profile structure clearly
type ProfileData = {
  full_name?: string
  username?: string
  email?: string
  location?: string
  timezone?: string
  profile_picture?: string
}

export default function IdentityStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setField('email', user.email || '')
      }
    }
    fetchUser()
  }, [setField])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const key = name as keyof ProfileData

    const formattedValue =
      key === 'username' ? slugifyUsername(value) : value

    setField(key, formattedValue)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    const filePath = `avatars/${uuidv4()}-${file.name}`
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file)
  
    if (uploadError) {
      setError(uploadError.message)
    } else {
      const imageUrl = `${BASE_S3_URL}/${filePath.replace('avatars/', '')}`
      setField('profile_picture', imageUrl)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('User not found')
      setLoading(false)
      return
    }

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile
    })

    if (upsertError) {
      setError(upsertError.message)
    } else {
      onNext()
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 1: Your Identity</h2>

      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={profile.full_name || ''}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        type="text"
        name="username"
        placeholder="Unique Username"
        value={profile.username || ''}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location (optional)"
        value={profile.location || ''}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <select
        name="timezone"
        value={profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      >
        {Intl.supportedValuesOf('timeZone').map((tz) => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>

      <div>
        <label className="block mb-1">Profile Picture (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {profile.profile_picture && (
          <img
            src={profile.profile_picture}
            alt="Profile"
            className="w-24 h-24 mt-2 rounded-full"
          />
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded mt-4"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}
