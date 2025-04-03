'use client'

import { useProfileStore } from '@/components/onboarding/useProfileStore'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function IdentityStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setField('email', user.email || '')
      }
    }
    fetchUser()
  }, [setField])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setField(name as keyof typeof profile, value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Who are you?</h2>

      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={profile.full_name || ''}
        onChange={handleChange}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white"
      />

      <input
        type="text"
        name="username"
        placeholder="Unique Username"
        value={profile.username || ''}
        onChange={handleChange}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white"
      />

      <button
        onClick={onNext}
        className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded"
      >
        Continue
      </button>
    </div>
  )
}