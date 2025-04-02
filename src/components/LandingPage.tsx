'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-gradient-to-b from-black via-zinc-900 to-black text-white font-sans">
      {/* Hero Section */}
      <motion.section
        className="snap-start min-h-screen flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/logo.png"
          alt="Cybernetix Logo"
          className="w-40 md:w-52 drop-shadow-[0_0_1.5rem_rgba(255,255,255,0.4)]"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        />

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent mt-6"
        >
          ✦ Cybernetix
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 max-w-xl text-lg text-zinc-300"
        >
          A decentralized sanctuary where your skills align with your soul.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex gap-4"
        >
          <Link href="/signin">
            <button className="border border-white px-6 py-2 rounded-xl text-lg hover:bg-white hover:text-black transition">
              Sign In
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Sacred Purpose */}
      <motion.section
        className="snap-start min-h-screen px-6 py-20 text-center bg-zinc-950 border-t border-zinc-800 flex flex-col justify-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8">The world needs your frequency.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {['Autonomy', 'Balance', 'Contribution'].map((pillar) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={pillar}
              className="p-6 rounded-xl bg-zinc-900 border border-zinc-700 shadow-md"
            >
              <h3 className="text-xl font-semibold text-purple-400">✦ {pillar}</h3>
              <p className="mt-2 text-sm text-zinc-400">
                {pillar === 'Autonomy' && 'Own your path. Work without compromise.'}
                {pillar === 'Balance' && 'Flow between logic and spirit. Code with clarity.'}
                {pillar === 'Contribution' && 'Your effort uplifts the whole. Be rewarded fairly.'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Archetypes */}
      <motion.section
        className="snap-start min-h-screen px-6 py-20 text-center bg-black flex flex-col justify-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8">Who are you in this universe?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {["Oracle", "Architect", "Alchemist", "Engineer", "Seer", "Cosmic Gardener"].map((role) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={role}
              className="p-6 rounded-xl bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg"
            >
              <h3 className="text-xl font-bold text-yellow-300">{role}</h3>
              <p className="mt-2 text-sm text-zinc-400">{getArchetypeBlurb(role)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="snap-start min-h-screen px-6 py-24 text-center bg-gradient-to-t from-zinc-900 to-black border-t border-zinc-800 flex flex-col justify-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6">
          Join the protocol. Shape the future from your center.
        </h2>
        <Link href="/signin">
          <button className="bg-white text-black px-8 py-3 rounded-xl text-lg hover:scale-105 transition shadow-md">
            Start Now
          </button>
        </Link>
      </motion.section>
    </div>
  )
}

function getArchetypeBlurb(role: string): string {
  const blurbs: { [key: string]: string } = {
    Oracle: 'You sense patterns and possibilities others can’t see.',
    Architect: 'You design systems that elevate society.',
    Alchemist: 'You transmute complexity into simplicity.',
    Engineer: 'You build what others only imagine.',
    Seer: 'You guide through intuition and insight.',
    'Cosmic Gardener': 'You nurture ecosystems for growth and harmony.'
  }
  return blurbs[role] || ''
}
