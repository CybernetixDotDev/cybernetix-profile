'use client'

import { useProfileStore } from './useProfileStore'

export default function SummaryStep({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: () => void
}) {
  const { profile } = useProfileStore()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Summary ✨</h2>

      <div className="space-y-4 text-sm text-zinc-300">
        <div>
          <span className="font-semibold text-white">Name:</span> {profile.full_name || '—'}
        </div>
        <div>
          <span className="font-semibold text-white">Username:</span> @{profile.username || '—'}
        </div>
        <div>
          <span className="font-semibold text-white">Email:</span> {profile.email || '—'}
        </div>
        <div>
          <span className="font-semibold text-white">Skills:</span>{' '}
          {profile.skills?.join(', ') || '—'}
        </div>
        <div>
          <span className="font-semibold text-white">Archetype:</span> {profile.archetype || '—'}
        </div>
        <div>
          <span className="font-semibold text-white">Mantra:</span>{' '}
          <span className="italic text-yellow-400">&quot;{profile.mantra || '—'}&quot;</span>
        </div>
        <div>
          <span className="font-semibold text-white">Bio:</span> {profile.bio || '—'}
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded"
        >
          ⬅ Back
        </button>
        <button
          onClick={onComplete}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow"
        >
          🚀 Save & Launch
        </button>
      </div>
    </div>
  )
}
