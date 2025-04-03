'use client'

import { useProfileStore } from './useProfileStore'

type SkillsStepProps = {
  onNext: () => void
  onBack: () => void
}

export default function SkillsStep({ onNext, onBack }: SkillsStepProps) {
  const { profile, setField } = useProfileStore()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setField(name as keyof typeof profile, value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Skills</h2>

      <select
        name="experience_level"
        value={profile.experience_level || ''}
        onChange={handleChange}
        className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
      >
        <option value="">Select your experience</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>

      {/* Add additional skill inputs as needed */}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
