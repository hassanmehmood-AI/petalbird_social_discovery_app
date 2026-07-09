import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const appPaths = ['/discover', '/profile', '/messages', '/ratings']
  const adminPaths = ['/admin']
  const isAppRoute = appPaths.some(p => request.nextUrl.pathname.startsWith(p))
  const isAdminRoute = adminPaths.some(p => request.nextUrl.pathname.startsWith(p))
  const isAuthRoute = ['/login', '/signup'].includes(request.nextUrl.pathname)

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/discover'
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && (isAppRoute || isAdminRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, is_deactivated')
      .eq('id', user.id)
      .single()

    if (profile?.is_deactivated) {
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('deactivated', '1')
      return NextResponse.redirect(url)
    }

    if (isAdminRoute && !profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/discover'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
