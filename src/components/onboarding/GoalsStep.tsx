'use client'

import { useProfileStore } from './useProfileStore'

export default function GoalsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { profile, setField } = useProfileStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setField(name as any, value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Vision & Voice</h2>

      <textarea
        name="mantra"
        placeholder="Share your mantra or guiding principle..."
        value={profile.mantra || ''}
        onChange={handleChange}
        rows={3}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white"
      />

      <textarea
        name="bio"
        placeholder="Describe your cosmic purpose or goals..."
        value={profile.bio || ''}
        onChange={handleChange}
        rows={5}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white"
      />

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