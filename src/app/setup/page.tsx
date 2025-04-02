'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ProfileCaptureForm from '@/components/ProfileCapture/ProfileCaptureForm'

export default function SetupPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signup')
      }
    }

    checkUser()
  }, [router])

  return <ProfileCaptureForm />
}

