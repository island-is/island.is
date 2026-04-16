import { NextRequest, NextResponse } from 'next/server'
import { ApplicationConfigurations } from '@island.is/application/types'

/**
 * Middleware that validates the incoming slug against ApplicationConfigurations.
 *
 * In production, the ingress layer routes traffic based on the useSdf flag
 * in ApplicationConfigurations. This middleware acts as the BFF-level check:
 *
 * - If useSdf is true for the slug, the request proceeds to Next.js.
 * - If useSdf is false or absent, the request is redirected to the legacy SPA.
 *
 * Slugs are derived from ApplicationConfigurations (single source of truth).
 * In Phase 5+, this could be replaced with a runtime ConfigCat lookup for
 * instant rollback (§8, Constraint 10).
 */

const SDF_ENABLED_SLUGS = new Set(
  Object.values(ApplicationConfigurations)
    .filter((c) => c.useSdf)
    .map((c) => c.slug),
)

const LEGACY_SPA_BASE =
  process.env.LEGACY_SPA_URL ?? 'http://localhost:4242'

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

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
