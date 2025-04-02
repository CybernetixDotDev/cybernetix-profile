import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar' // ⬅️ Add this

export const metadata: Metadata = {
  title: 'Cybernetix',
  description: 'Empower your cosmic purpose',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar /> {/* ⬅️ Add this */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
