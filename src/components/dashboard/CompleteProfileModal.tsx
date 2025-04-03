// components/dashboard/CompleteProfileModal.tsx
'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'
import { useProfileStore, ProfileData } from '@/components/onboarding/useProfileStore'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: () => Promise<void>
  initialProfile: Partial<ProfileData>
}

export default function CompleteProfileModal({ isOpen, onClose, onSave, initialProfile }: Props) {
  const { setField } = useProfileStore()
  const { data: session } = useSession()
  const [localProfile, setLocalProfile] = useState(initialProfile)

  const handleChange = (field: keyof typeof localProfile, value: string) => {
    setLocalProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error('❌ No user ID found in session')
      return
    }

    // 1. Update the Zustand store
    (Object.entries(localProfile) as [keyof ProfileData, ProfileData[keyof ProfileData]][]).forEach(
      ([key, value]) => {
        setField(key, value)
      }
    )

    // 2. Upsert to Supabase
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      ...localProfile,
    })

    if (error) {
      console.error('❌ Error saving profile to Supabase:', error)
      return
    }

    // 3. Close modal
    await onSave()
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 text-white p-6 align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6">
                  ✨ Complete Your Cosmic Profile
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm">Full Name</label>
                    <input
                      value={localProfile.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Username</label>
                    <input
                      value={localProfile.username || ''}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Email</label>
                    <input
                      value={localProfile.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Archetype</label>
                    <input
                      value={localProfile.archetype || ''}
                      onChange={(e) => handleChange('archetype', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Experience Level</label>
                    <input
                      value={localProfile.experience_level || ''}
                      onChange={(e) => handleChange('experience_level', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm">Bio</label>
                    <textarea
                      value={localProfile.bio || ''}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded shadow"
                  >
                    Save My Profile
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}