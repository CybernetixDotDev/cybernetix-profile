'use client'

import { useState } from 'react'
import { ProfileFieldKey } from '../useProfileStore' // adjust path if needed

const tagInputStyle = "bg-black border border-gray-600 p-2 rounded w-full text-white"

export type TagInputProps = {
  label: string
  name: ProfileFieldKey
  value: string[]
  onChange: (name: ProfileFieldKey, value: string[]) => void
}

export function TagInput({ label, name, value, onChange }: TagInputProps) {
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
