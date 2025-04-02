// AvailabilityStep.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useProfileStore } from '../useProfileStore'


const collabOptions = ['Async', 'Real-Time', 'Solo', 'Pair Programming', 'Open to Anything']
const inputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

export default function AvailabilityStep({ onNext }: { onNext: () => void }) {
  const { profile, setField, resetProfile } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setField(name as keyof typeof profile, value)
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
      ...profile,
      updated_at: new Date().toISOString()
    })

    if (upsertError) {
      setError(upsertError.message)
    } else {
      resetProfile() // optional: reset store after success
      onNext()
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 4: Availability & Access</h2>

      <div>
        <label className="block mb-1">Your Availability</label>
        <input
          type="text"
          name="availability"
          value={profile.availability || ''}
          onChange={handleChange}
          placeholder="e.g. 10 hrs/week, weekends only"
          className={inputStyle}
        />
      </div>

      <div>
        <label className="block mb-1">Preferred Collaboration Style</label>
        <select
          name="preferred_collab"
          value={profile.preferred_collab || collabOptions[0]}
          onChange={handleChange}
          className={inputStyle}
        >
          {collabOptions.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Hardware Info (Optional)</label>
        <input
          type="text"
          name="hardware"
          value={profile.hardware || ''}
          onChange={handleChange}
          placeholder="e.g. Ryzen 5 laptop, mobile only"
          className={inputStyle}
        />
      </div>

      <div>
        <label className="block mb-1">Access Needs (Optional)</label>
        <textarea
          name="access_needs"
          value={profile.access_needs || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Share anything that helps us support you better"
          className={inputStyle}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded mt-4"
      >
        {loading ? 'Saving...' : 'Finish'}
      </button>
    </div>
  )
}
