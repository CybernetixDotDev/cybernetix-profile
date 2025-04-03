// components/ui/CosmicLoader.tsx
'use client'

import { motion } from 'framer-motion'

export default function CosmicLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <p className="text-pink-400 font-medium tracking-wide text-sm animate-pulse">
        Aligning your cosmic aura ✨
      </p>
    </div>
  )
}