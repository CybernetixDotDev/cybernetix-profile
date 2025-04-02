'use client'

import { useState } from 'react'
import { useProfileStore } from './useProfileStore'
import { ProfileFieldKey } from './useProfileStore'
import { TagInput } from './TagInput'

const skillLevels = ['Beginner', 'Intermediate', 'Expert', 'Explorer']
const tagInputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

export default function SkillsStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: ProfileFieldKey, value: string[] | string) => {
    setField(name, value as any)
  }

  const handleSubmit = async () => {
    onNext() // saving handled at the final step
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 2: Skills & Interests</h2>

      <TagInput
        label="Technical Skills"
        name="skills"
        value={profile.skills || []}
        onChange={handleChange}
      />

      <TagInput
        label="Soft Skills"
        name="soft_skills"
        value={profile.soft_skills || []}
        onChange={handleChange}
      />

      <TagInput
        label="Interests"
        name="interests"
        value={profile.interests || []}
        onChange={handleChange}
      />

      <TagInput
        label="Willing to Learn"
        name="willing_to_learn"
        value={profile.willing_to_learn || []}
        onChange={handleChange}
      />

      <div>
        <label className="block mb-1 text-white">Experience Level</label>
        <select
          name="experience_level"
          value={profile.experience_level || 'Explorer'}
          onChange={(e) => handleChange('experience_level', e.target.value)}
          className={tagInputStyle}
        >
          {skillLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded mt-4"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </div>
  )
}
