import { Suspense } from 'react'
import SignupPage from '@/components/SignupPage'

export default function SignupRoute() {
  return (
    <Suspense fallback={<div className="text-white">Loading signup...</div>}>
      <SignupPage />
    </Suspense>
  )
}
