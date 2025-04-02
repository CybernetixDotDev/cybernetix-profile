'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Session } from '@supabase/supabase-js'

type UserProfile = {
  full_name: string | null
  profile_picture: string | null
}

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, profile_picture')
          .eq('id', session.user.id)
          .maybeSingle()

        setProfile(profileData)
      }
    }

    getSessionAndProfile()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setProfile(null)
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

  const navLink = (href: string, label: string) => (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Link href={href} className="hover:text-purple-400 transition">
        {label}
      </Link>
    </motion.div>
  )

  return (
    <nav className="w-full bg-black text-white border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-wide hover:text-purple-400 transition">
        ✦ Cybernetix
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/tasks', 'Tasks')}
            {navLink('/contribute', 'Contribute')}
            {navLink('/profile', 'Profile')}

            {profile?.profile_picture && (
              <img
                src={profile.profile_picture}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-white object-cover"
              />
            )}

            {profile?.full_name && (
              <span className="text-sm italic text-zinc-400">{profile.full_name}</span>
            )}

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition ml-2"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            {navLink('/signup', 'Sign Up')}
            {navLink('/login', 'Log In')}
          </>
        )}
      </div>
    </nav>
  )
}
