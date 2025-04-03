'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

import IdentityStep from '@/components/onboarding/IdentityStep'
import SkillsStep from '@/components/onboarding/SkillsStep'
import GoalsStep from '@/components/onboarding/GoalsStep'
import SummaryStep from '@/components/onboarding/SummaryStep'
import { useProfileStore } from '@/components/onboarding/useProfileStore'

const steps = ['identity', 'skills', 'goals', 'summary'] as const

export default function OnboardingFlow() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stepIndex, setStepIndex] = useState(0)
  const { profile, resetProfile } = useProfileStore()

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0))

  const handleComplete = async () => {
    console.log("💫 Attempting to save profile...")
    console.log("Profile Data:", profile)

    if (!session?.user?.id) {
      console.error('❌ No user ID found in session')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      ...profile,
    })

    if (error) {
      console.error('❌ Error saving profile:', error)
    } else {
      resetProfile() // ✅ Clear form state
      router.push('/dashboard')
    }
  }

  const renderStep = () => {
    switch (steps[stepIndex]) {
      case 'identity':
        return <IdentityStep onNext={nextStep} />
      case 'skills':
        return <SkillsStep onNext={nextStep} onBack={prevStep} />
      case 'goals':
        return <GoalsStep onNext={nextStep} onBack={prevStep} />
      case 'summary':
        return <SummaryStep onBack={prevStep} onComplete={handleComplete} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Cybernetix ✦</h1>
      <div className="text-sm text-zinc-400 mb-4">Step {stepIndex + 1} of {steps.length}</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
