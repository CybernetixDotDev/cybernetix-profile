'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checkingProfile, setCheckingProfile] = useState(true)

  const checkProfile = useCallback(async () => {
    if (!session?.user?.id) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle()

    if (!profile || error) {
      router.replace('/onboardingflow')
    } else {
      setCheckingProfile(false)
    }
  }, [session?.user?.id, router])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') router.replace('/signin')
    if (status === 'authenticated') checkProfile()
  }, [status, checkProfile, router])

  if (status === 'loading' || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-400 border-opacity-50"></div>
          <p className="text-pink-300 font-light text-sm">Gathering your stardust...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name} 👋</h1>
      {/* You can display dashboard data here */}
    </div>
  )
}
