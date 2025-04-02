'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { slugifyUsername } from '@/utils/slugify'

const BASE_S3_URL = 'https://tzuzzjxocpuintdjxjqr.supabase.co/storage/v1/object/public/avatars'

export default function IdentityStep({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    profile_picture: '',
    email: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setForm((prev) => ({ ...prev, email: user.email || '' }))
    }
    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'username' ? slugifyUsername(value) : value })
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
      setForm({ ...form, profile_picture: imageUrl })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setError('User not found')

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form
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
        value={form.full_name}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        type="text"
        name="username"
        placeholder="Unique Username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location (optional)"
        value={form.location}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <select
        name="timezone"
        value={form.timezone}
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
        {form.profile_picture && (
          <img src={form.profile_picture} alt="Profile" className="w-24 h-24 mt-2 rounded-full" />
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
