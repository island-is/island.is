import { NextRequest, NextResponse } from 'next/server'
import { SDF_ENABLED_APPLICATION_SLUGS } from '@island.is/application/types'
import { buildCsp, CSP_HEADER, generateNonce, NONCE_HEADER } from './lib/csp'

// Validates the incoming application slug against the SDF allowlist.

const SDF_ENABLED_SLUGS = new Set(SDF_ENABLED_APPLICATION_SLUGS)

const LEGACY_SPA_BASE =
  process.env.LEGACY_SPA_URL ??
  (process.env.NODE_ENV !== 'production' ? 'http://localhost:4242' : undefined)

export const middleware = (request: NextRequest) => {
  // basePath (`/umsoknir/sdf`) is already stripped from `pathname`.
  const { pathname } = request.nextUrl
  const slug = pathname.split('/')[1]

  if (!slug || SDF_ENABLED_SLUGS.has(slug)) {
    // SDF page request → own the CSP here with a fresh per-request nonce.
    const nonce = generateNonce()
    const csp = buildCsp(nonce)

    // Setting the CSP (and nonce) on the *request* headers lets Next read the
    // nonce and stamp it onto its bootstrap/hydration scripts during SSR;
    // `x-nonce` exposes it to the layout for any app-authored inline scripts.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(NONCE_HEADER, nonce)
    requestHeaders.set(CSP_HEADER, csp)

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    // And on the *response* so the browser actually enforces the policy.
    response.headers.set(CSP_HEADER, csp)
    return response
  }

  // Not an SDF app → hand back to the legacy form under `/umsoknir/<slug>`,
  // preserving the full path and query string.
  const legacyUrl = new URL(
    `/umsoknir${pathname}`,
    LEGACY_SPA_BASE ?? request.url,
  )
  legacyUrl.search = request.nextUrl.search
  return NextResponse.redirect(legacyUrl)
}

export const config = {
  // Relative to basePath (Next prefixes it with `/umsoknir/sdf`). Skip Next
  // internals, the auth handoff routes, and any file request (has a dot).
  matcher: '/((?!_next/static|_next/image|auth|favicon.ico|.*\\..*).*)',
}
