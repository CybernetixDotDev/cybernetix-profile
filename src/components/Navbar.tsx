'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.push('/')
  }

  return (
    <nav className="w-full bg-black text-white border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-wide hover:text-purple-400 transition">
        ✦ Cybernetix
      </Link>

      <div className="flex gap-4 items-center">
        {!session ? (
          <>
            <Link href="/signup" className="hover:text-purple-400 transition">Sign Up</Link>
            <Link href="/login" className="hover:text-purple-400 transition">Log In</Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="hover:text-purple-400 transition">Profile</Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
