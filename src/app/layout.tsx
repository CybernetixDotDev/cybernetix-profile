import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Cybernetix',
  description: 'Unlock your cosmic potential.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
