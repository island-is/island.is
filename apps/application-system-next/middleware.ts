import { NextRequest, NextResponse } from 'next/server'
import { SDF_ENABLED_APPLICATION_SLUGS } from '@island.is/application/types'

/**
 * Middleware that validates the incoming slug against the SDF allowlist.
 *
 * In production, the ingress layer routes traffic based on the useSdf flag
 * in ApplicationConfigurations. This middleware acts as the BFF-level check:
 *
 * - If the slug is in `SDF_ENABLED_APPLICATION_SLUGS`, the request proceeds to Next.js.
 * - Otherwise, the request is redirected to the legacy SPA.
 *
 * Slugs are listed explicitly in `SDF_ENABLED_APPLICATION_SLUGS` (see that module)
 * so the Edge bundle stays reliable; `sdfEnabledApplicationSlugs.spec.ts` keeps the
 * list in sync with `ApplicationConfigurations`.
 */

const SDF_ENABLED_SLUGS = new Set(SDF_ENABLED_APPLICATION_SLUGS)

const LEGACY_SPA_BASE = process.env.LEGACY_SPA_URL ?? 'http://localhost:4242'

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Everything under /umsoknir/sdf is served by this app; no redirect needed.
  if (pathname === '/umsoknir/sdf' || pathname.startsWith('/umsoknir/sdf/')) {
    return NextResponse.next()
  }

  const match = pathname.match(/^\/umsoknir\/([^/]+)/)
  if (!match) {
    return NextResponse.next()
  }

  const slug = match[1]

  if (!SDF_ENABLED_SLUGS.has(slug)) {
    const legacyUrl = new URL(pathname, LEGACY_SPA_BASE)
    legacyUrl.search = request.nextUrl.search
    return NextResponse.redirect(legacyUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/umsoknir/:slug*',
}
