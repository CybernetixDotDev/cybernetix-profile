import { Suspense } from 'react'
import LoginPage from '@/components/LoginPage'

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="text-white">Loading login...</div>}>
      <LoginPage />
    </Suspense>
  )
}
