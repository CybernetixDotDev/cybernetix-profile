'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const archetypes = [
  "Alchemist",
  "Architect",
  "Oracle",
  "Disruptor",
  "Navigator",
  "Visionary",
  "Engineer",
  "Seer",
  "Cosmic Gardener"
]

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

export default function CosmicStep({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    cosmic_archetype: archetypes[0],
    values: [] as string[],
    mantra: '',
    bio: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleTagChange = (name: string, value: string[]) => {
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
      <h2 className="text-2xl font-bold mb-4">Step 3: Cosmic Alignment</h2>

      <div>
        <label className="block mb-1 text-white">Choose Your Archetype</label>
        <select
          name="cosmic_archetype"
          value={form.cosmic_archetype}
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
        value={form.values}
        onChange={handleTagChange}
      />

      <div>
        <label className="block mb-1 text-white">Your Mantra (Optional)</label>
        <textarea
          name="mantra"
          value={form.mantra}
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
          value={form.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell the world your origin story or cosmic mission…"
          className={tagInputStyle}
        />
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
