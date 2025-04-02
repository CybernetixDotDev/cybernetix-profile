'use client'

import IdentityStep from '@/components/IdentityStep'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    setCompleted(true)
    setTimeout(() => router.push('/dashboard'), 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Let’s complete your cosmic profile ✨</h1>

      {!completed ? (
        <IdentityStep onNext={handleNext} />
      ) : (
        <div className="text-green-400 font-medium mt-10 animate-pulse">
          Profile saved! Redirecting to your dashboard...
        </div>
      )}
    </div>
  )
}
