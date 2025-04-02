'use client'

import { useState } from 'react'
import { useProfileStore, ProfileFieldKey } from './useProfileStore'

const archetypes = [
  "Alchemist", "Architect", "Oracle", "Disruptor",
  "Navigator", "Visionary", "Engineer", "Seer", "Cosmic Gardener"
]

const tagInputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

type TagInputProps = {
  label: string
  name: ProfileFieldKey
  value: string[]
  onChange: (name: ProfileFieldKey, value: string[]) => void
}

function TagInput({ label, name, value, onChange }: TagInputProps) {
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

// ✅ ADD THIS COMPONENT EXPORT!
export default function CosmicStep({ onNext }: { onNext: () => void }) {
  const { profile, setField } = useProfileStore()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setField(name as ProfileFieldKey, value)
  }

  const handleTagChange = (name: ProfileFieldKey, value: string[]) => {
    setField(name, value)
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Step 3: Cosmic Alignment</h2>

      <div>
        <label className="block mb-1 text-white">Choose Your Archetype</label>
        <select
          name="archetype"
          value={profile.archetype || archetypes[0]}
          onChange={handleChange}
          className={tagInputStyle}
        >
          {archetypes.map((archetype) => (
            <option key={archetype} value={archetype}>{archetype}</option>
          ))}
        </select>
      </div>

      <TagInput
        label="Core Values (Press Enter to Add)"
        name="values"
        value={profile.values || []}
        onChange={handleTagChange}
      />

      <div>
        <label className="block mb-1 text-white">Your Mantra (Optional)</label>
        <textarea
          name="mantra"
          value={profile.mantra || ''}
          onChange={handleChange}
          rows={2}
          placeholder="E.g. I build futures where none existed before."
          className={tagInputStyle}
        />
      </div>

      <div>
        <label className="block mb-1 text-white">Your Cosmic Bio</label>
        <textarea
          name="bio"
          value={profile.bio || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Tell the world your origin story or cosmic mission…"
          className={tagInputStyle}
        />
      </div>

      <button
        onClick={onNext}
        className="bg-white text-black px-4 py-2 rounded mt-4"
      >
        Continue
      </button>
    </div>
  )
}
