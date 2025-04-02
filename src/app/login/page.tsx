// ✅ app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectMessage = searchParams.get('redirect')
  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', loginData.user.id)
      .maybeSingle()

    const redirectPath = redirectMessage || (profile ? '/profile' : '/setup')
    router.push(redirectPath)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center">Log In</h1>

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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black px-4 py-2 rounded"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </div>
    </div>
  )
}
