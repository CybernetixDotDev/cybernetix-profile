'use client'

import { useState } from 'react'
import IdentityStep from '../IdentityStep'
import SkillsStep from './SkillsStep'
import CosmicStep from './CosmicStep'
import AvailabilityStep from './AvailabilityStep'
import { useRouter } from 'next/navigation'

export default function ProfileCaptureForm() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const steps = [
    <IdentityStep key="step-1" onNext={() => setStep(step + 1)} />,
    <SkillsStep key="step-2" onNext={() => setStep(step + 1)} />,
    <CosmicStep key="step-3" onNext={() => setStep(step + 1)} />,
    <AvailabilityStep key="step-4" onNext={() => router.push('/profile')} />,
  ]

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-2xl shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold">Cybernetix: Build Your Profile</h1>
          <p className="text-gray-400 mt-2">Step {step + 1} of {steps.length}</p>
        </div>
        {steps[step]}
      </div>
    </div>
  )
}
