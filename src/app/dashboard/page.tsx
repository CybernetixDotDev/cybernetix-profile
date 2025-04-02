'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-white p-6">Loading...</div>
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name} 👋</h1>
      {/* Add your dashboard content here */}
    </div>
  )
}
