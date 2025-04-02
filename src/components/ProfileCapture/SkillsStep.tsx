'use client'

import { TagInput } from './TagInput'
import { useProfileStore, ProfileData, ProfileFieldKey } from './useProfileStore'

const skillLevels = ['Beginner', 'Intermediate', 'Expert', 'Explorer']
const tagInputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

export default function SkillsStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()

  const handleChange = <K extends ProfileFieldKey>(name: K, value: ProfileData[K]) => {
    setField(name, value)
  }

  const handleSubmit = () => {
    onNext() // saving handled in final step
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

      <button
        onClick={handleSubmit}
        className="bg-white text-black px-4 py-2 rounded mt-4"
      >
        Continue
      </button>
    </div>
  )
}
