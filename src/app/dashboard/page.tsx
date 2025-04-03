'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useProfileStore, ProfileData, ProfileFieldKey } from '@/components/onboarding/useProfileStore'
import CosmicLoader from '@/components/ui/CosmicLoader'
import ProfileCompleteness from '@/components/dashboard/ProfileCompleteness'
import CompleteProfileModal from '@/components/dashboard/CompleteProfileModal'



export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setField, profile } = useProfileStore()
  const [loading, setLoading] = useState(true)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.id) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!data) {
        setShowCompleteModal(true)
      } else {
        Object.entries(data).forEach(([key, value]) => {
          setField(key as ProfileFieldKey, value as ProfileData[ProfileFieldKey])
        })
        
      }

      setLoading(false)
    }

    if (status === 'authenticated') {
      checkProfile()
    } else if (status === 'unauthenticated') {
      router.replace('/signin')
    }
  }, [status, session?.user?.id, router, setField])

  const handleProfileSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session?.user?.id, ...profile })

    if (!error) {
      setShowCompleteModal(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <CosmicLoader />
      </div>
    )
  }

  return (
    <div className="text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name} 👋</h1>

      <ProfileCompleteness
  profile={profile}
  onCompleteProfileClick={() => setShowCompleteModal(true)}
/>

      <CompleteProfileModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        initialProfile={profile}
        onSave={handleProfileSave}
      />

      {/* Future dashboard widgets here */}
    </div>
  )
}
