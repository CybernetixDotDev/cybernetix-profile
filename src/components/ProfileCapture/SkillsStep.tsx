'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const skillLevels = ['Beginner', 'Intermediate', 'Expert', 'Explorer']

const tagInputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

function TagInput({ label, name, value, onChange }: {
  label: string,
  name: string,
  value: string[],
  onChange: (name: string, value: string[]) => void
}) {
  const [input, setInput] = useState('')

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      onChange(name, [...value, input.trim()])
      setInput('')
    }
  }

  const handleRemove = (tag: string) => {
    onChange(name, value.filter((t) => t !== tag))
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 text-white">{label}</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleAdd}
        placeholder="Type and press enter..."
        className={tagInputStyle}
      />
      <div className="flex flex-wrap mt-2 gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-white text-black px-2 py-1 rounded-full text-sm cursor-pointer"
            onClick={() => handleRemove(tag)}
          >
            {tag} ✕
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillsStep({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    technical_skills: [] as string[],
    soft_skills: [] as string[],
    interests: [] as string[],
    willing_to_learn: [] as string[],
    experience_level: 'Explorer'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: string, value: string[] | string) => {
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setError('User not found')

    const { error: upsertError } = await supabase.from('profiles').update({
      ...form
    }).eq('id', user.id)

    if (upsertError) {
      setError(upsertError.message)
    } else {
      onNext()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 2: Skills & Interests</h2>

      <TagInput
        label="Technical Skills"
        name="technical_skills"
        value={form.technical_skills}
        onChange={handleChange}
      />

      <TagInput
        label="Soft Skills"
        name="soft_skills"
        value={form.soft_skills}
        onChange={handleChange}
      />

      <TagInput
        label="Interests"
        name="interests"
        value={form.interests}
        onChange={handleChange}
      />

      <TagInput
        label="Willing to Learn"
        name="willing_to_learn"
        value={form.willing_to_learn}
        onChange={handleChange}
      />

      <div>
        <label className="block mb-1 text-white">Experience Level</label>
        <select
          name="experience_level"
          value={form.experience_level}
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
