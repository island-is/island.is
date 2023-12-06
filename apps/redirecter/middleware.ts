import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// See https://nextjs.org/docs/app/building-your-application/routing/defining-routes
// for tutorial etc.

const pathPrefix = '/r'

// TODO: Set up as a database
const redirects: Record<string, string> = {
  '/test-nx': 'https://nx.dev',
  '/test-google': 'https://google.com',
  '/test-bing': 'https://bing.com',
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(pathPrefix, '')
  const destination = redirects[pathname]
  console.log(`Redirecting ${pathname} -> ${destination}`)
  if (destination) {
    return NextResponse.redirect(destination, { status: 307 })
  }
  // Redirect by default to the root
  return NextResponse.redirect(request.nextUrl.origin, { status: 307 })
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: `${pathPrefix}:path*`,
}
console.log('Redirect config', config)
