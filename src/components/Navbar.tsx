'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type UserProfile = {
  full_name: string | null
  profile_picture: string | null
}

export default function Navbar() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [squish, setSquish] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, profile_picture')
          .eq('id', session.user.id)
          .maybeSingle()

        if (profileData) setProfile(profileData)
      }
    }
    fetchProfile()
  }, [session])

  useEffect(() => {
    const handleScroll = () => setSquish(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLink = (href: string, label: string) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href={href} className="hover:text-purple-400 transition text-lg">
        {label}
      </Link>
    </motion.div>
  )

  return (
    <motion.nav
      className={`fixed top-0 z-50 w-full px-6 transition-all duration-300 border-b border-zinc-800 ${
        squish ? 'py-2 bg-black/90 backdrop-blur' : 'py-5 bg-black'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Floating Logo */}
        <motion.div
          whileHover={{ y: -4, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-2xl font-bold tracking-wide"
        >
          <Link href="/" className="hover:text-purple-400 transition">✦ Cybernetix</Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {status === 'authenticated' ? (
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
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-400 hover:text-red-300 transition ml-2 text-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {navLink('/signin', 'Log In')}
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg w-48 py-4 px-6 flex flex-col gap-4 text-sm z-40">
            {status === 'authenticated' ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/tasks', 'Tasks')}
                {navLink('/contribute', 'Contribute')}
                {navLink('/profile', 'Profile')}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-red-400 text-left">Log Out</button>
              </>
            ) : (
              <>
                {navLink('/signin', 'Log In')}
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  )
}
