import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  // 🛡️ This will securely decode the Supabase session cookie
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  console.log('🧪 MIDDLEWARE USER:', user)
  if (error) {
    console.warn('⚠️ Supabase cookie parse failed:', error.message)
  }

  const protectedRoutes = ['/dashboard', '/tasks', '/contribute']

  if (protectedRoutes.includes(req.nextUrl.pathname) && !user) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url)
    )
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/contribute/:path*'],
}
