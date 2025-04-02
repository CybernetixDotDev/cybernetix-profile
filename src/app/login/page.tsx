import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LoginPage = dynamic(() => import('@/components/LoginPage'), {
  ssr: false,
})

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="text-white">Loading login...</div>}>
      <LoginPage />
    </Suspense>
  )
}
