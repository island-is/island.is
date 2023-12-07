import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { logger } from '@island.is/logging'
const logger = console

// See https://nextjs.org/docs/app/building-your-application/routing/defining-routes
// for tutorial etc.

const redirectSubdomain = 'redirect'

export const config = {
  matcher: `/:path*`,
}
logger.info('Redirect config', config)

// TODO: Set up as a database
const redirects: Record<string, string | ((path: URL) => string)> = {
  '/test-nx': 'https://nx.dev',
  '/test-relative': '/foo',
  '/test-func': (p: URL) => `${p.pathname.replace(/[aeiou]/g, '_')}`,
  '/test-devland': (p: URL) =>
    `https://beta.dev01.devland.is${p.pathname.replace(/-/g, '/')}`,
}

const noRedirectPaths = [
  '/',
  '/about',
  '/contact',
  '/404',
  '/liveness',
  '/readiness',
  '/robots.txt',
  '/_next',
  '/_nextjs',
  '/favicon.ico',
]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const rootPath = request.nextUrl.pathname.split('/').slice(0, 2).join('/')
  if (noRedirectPaths.includes(rootPath)) {
    logger.info(`Skipping redirect for ${rootPath}`)
    return NextResponse.next()
  }
  logger.info(`Handling redirect for ${request.nextUrl}`)

  if (!pathname || pathname.search(/^\/r\/?$/) === 0) {
    logger.info(`Redirecting ${request.nextUrl} -> / (root)`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!redirects[pathname]) {
    logger.info(`No redirect found for '${pathname}', redirecting to /404`)
    return NextResponse.redirect(new URL('/404', request.url))
  }

  const redirect = redirects[pathname]
  const destination =
    (typeof redirect === 'string' ? redirect : redirect(request.nextUrl)) +
    request.nextUrl.search
  logger.info(`Found redirect '${pathname}' -> '${destination}'`)

  if (destination.startsWith('/')) {
    logger.info(`Redirecting ${request.nextUrl} -> ${destination} (relative)`)

    // Remove subdomain, and add beta in its place if it's devland
    const url = new URL(
      destination,
      request.nextUrl.origin.replace(
        new RegExp(`${redirectSubdomain}\\.(dev|staging)\\d+\.devland\\.is`),
        '$1.dev01.devland.is',
      ),
    )
    return NextResponse.redirect(url, { status: 307 })
  }

  logger.info(`Redirecting ${request.nextUrl} -> ${destination} (absolute)`)
  return NextResponse.redirect(destination, { status: 307 })
}
