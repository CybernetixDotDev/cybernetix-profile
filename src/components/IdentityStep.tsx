'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { slugifyUsername } from '@/utils/slugify'
import { useProfileStore } from './ProfileCapture/useProfileStore'

const BASE_S3_URL = 'https://tzuzzjxocpuintdjxjqr.supabase.co/storage/v1/object/public/avatars'

export default function IdentityStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      setField('email', session.user.email)
    }
  }, [session?.user?.email, setField])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setField(name as keyof typeof profile, name === 'username' ? slugifyUsername(value) : value)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const filePath = `avatars/${uuidv4()}-${file.name}`
    const { error: uploadError } = await supabase.storage
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

    const userId = session?.user?.id
    if (!userId) {
      setError('User not authenticated.')
      setLoading(false)
      return
    }

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: userId,
      ...profile
    })

    if (upsertError) {
      setError(upsertError.message)
    } else {
      onNext()
    }

    setLoading(false)
  }

  const calculateProgress = () => {
    const fields = ['full_name', 'username', 'location', 'timezone', 'profile_picture']
    const filled = fields.filter((field) => profile[field])
    return Math.floor((filled.length / fields.length) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 1: Your Identity</h2>

      <div className="w-full bg-zinc-800 rounded h-3 overflow-hidden">
        <div
          className="bg-purple-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-zinc-400">Profile completeness: {progress}%</p>

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
            className="w-24 h-24 mt-2 rounded-full border border-zinc-700"
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
