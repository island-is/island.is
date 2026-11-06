/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { SDF_ENABLED_APPLICATION_SLUGS } from '@island.is/application/types'

import { proxy } from './proxy'
import { CSP_HEADER } from './lib/csp'

// `proxy` receives paths with the basePath (`/umsoknir/sdf`) already stripped.
const requestFor = (path: string) =>
  new NextRequest(new URL(path, 'https://island.is'))

describe('application-system-next proxy', () => {
  it('sets the CSP on the sign-in handoff page instead of redirecting it', () => {
    const response = proxy(requestFor('/auth/login?target_link_uri=%2F'))

    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get(CSP_HEADER)).toContain("frame-ancestors 'none'")
  })

  it('serves an SDF-enabled application with the CSP', () => {
    const [slug] = SDF_ENABLED_APPLICATION_SLUGS

    const response = proxy(requestFor(`/${slug}/123`))

    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get(CSP_HEADER)).toContain("frame-ancestors 'none'")
  })

  it('serves the root path with the CSP', () => {
    const response = proxy(requestFor('/'))

    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get(CSP_HEADER)).toContain("frame-ancestors 'none'")
  })

  it('redirects any other application to the legacy form, keeping the path and query', () => {
    const response = proxy(requestFor('/not-an-sdf-application/123?step=2'))

    const location = new URL(response.headers.get('location') ?? '')
    expect(location.pathname).toBe('/umsoknir/not-an-sdf-application/123')
    expect(location.search).toBe('?step=2')
    expect(response.headers.get(CSP_HEADER)).toBeNull()
  })
})
