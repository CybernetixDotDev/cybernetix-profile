'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setError('Account already exists. Try logging in instead.')
      } else {
        setError(error.message)
      }
    } else {
      const redirectPath = searchParams.get('redirect') || '/setup'
      router.push(redirectPath)
    }

    setLoading(false)
  }

  const redirectMessage = searchParams.get('redirect')

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4">

        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        {redirectMessage && (
          <p className="text-yellow-400 text-sm text-center border border-yellow-500 p-2 rounded">
            You must log in to access: <code className="text-white">{redirectMessage}</code>
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-black border border-gray-600 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-black border border-gray-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-white text-black px-4 py-2 rounded"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account? <a href={`/login?redirect=${redirectMessage || ''}`} className="underline">Log in</a>
        </p>
      </div>
    </div>
  )
}
