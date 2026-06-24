import { NextRequest, NextResponse } from 'next/server'
import { SDF_ENABLED_APPLICATION_SLUGS } from '@island.is/application/types'

/**
 * Validates the incoming application slug against the SDF allowlist.
 *
 * This app is mounted under `basePath: '/umsoknir/sdf'` (see `next.config.js`),
 * and the deployed ingress routes only `/umsoknir/sdf/*` here while
 * `application-system-form` owns the rest of `/umsoknir/*`. Because of the
 * basePath, `request.nextUrl.pathname` is already basePath-relative here — a
 * request to `/umsoknir/sdf/<slug>` arrives as `/<slug>` (and the matcher below
 * is likewise relative; Next prefixes it with the basePath at build time).
 *
 * - If the first path segment is an SDF-enabled slug, the request proceeds.
 * - Otherwise we redirect to the legacy form at `/umsoknir/<slug>` so old
 *   (non-SDF) applications keep working. In production this is a same-origin
 *   redirect (the ingress sends `/umsoknir/*` to the form); locally
 *   `LEGACY_SPA_URL` points it at the form dev server (`:4242`).
 *
 * Slugs are listed explicitly in `SDF_ENABLED_APPLICATION_SLUGS` (see that
 * module) so the Edge bundle stays reliable; `sdfEnabledApplicationSlugs.spec.ts`
 * keeps the list in sync with `ApplicationConfigurations`.
 */

const SDF_ENABLED_SLUGS = new Set(SDF_ENABLED_APPLICATION_SLUGS)

const LEGACY_SPA_BASE =
  process.env.LEGACY_SPA_URL ??
  (process.env.NODE_ENV !== 'production' ? 'http://localhost:4242' : undefined)

export const middleware = (request: NextRequest) => {
  // basePath (`/umsoknir/sdf`) is already stripped from `pathname`.
  const { pathname } = request.nextUrl
  const slug = pathname.split('/')[1]

  if (!slug || SDF_ENABLED_SLUGS.has(slug)) {
    return NextResponse.next()
  }

  // Not an SDF app → hand back to the legacy form under `/umsoknir/<slug>`,
  // preserving the full path and query string.
  const legacyUrl = new URL(`/umsoknir${pathname}`, LEGACY_SPA_BASE ?? request.url)
  legacyUrl.search = request.nextUrl.search
  return NextResponse.redirect(legacyUrl)
}

export const config = {
  // Relative to basePath (Next prefixes it with `/umsoknir/sdf`). Skip Next
  // internals, the auth handoff routes, and any file request (has a dot).
  matcher: '/((?!_next/static|_next/image|auth|favicon.ico|.*\\..*).*)',
}
