import type { GraphQLContext } from '@island.is/auth-nest-tools'

import { getPayerRequestInfo } from './payments.utils'

type Req = GraphQLContext['req']

const buildReq = ({
  ip,
  remoteAddress,
  headers = {},
}: {
  ip?: string
  remoteAddress?: string
  headers?: Record<string, string | string[]>
}): Req =>
  ({
    ip,
    socket: { remoteAddress },
    headers,
  } as unknown as Req)

describe('getPayerRequestInfo', () => {
  it('uses the first x-forwarded-for hop', () => {
    const req = buildReq({
      ip: '10.1.2.3',
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.1' },
    })

    expect(getPayerRequestInfo(req).ipAddress).toBe('198.51.100.1')
  })

  it('falls back to the request IP when x-forwarded-for is missing', () => {
    const req = buildReq({ ip: '203.0.113.7' })

    expect(getPayerRequestInfo(req).ipAddress).toBe('203.0.113.7')
  })

  it('falls back to the socket address when the request IP is unavailable', () => {
    const req = buildReq({ remoteAddress: '203.0.113.7' })

    expect(getPayerRequestInfo(req).ipAddress).toBe('203.0.113.7')
  })

  it('skips candidates that do not parse as an IP', () => {
    const req = buildReq({
      ip: '203.0.113.7',
      headers: { 'x-forwarded-for': 'not-an-ip, 10.0.0.1' },
    })

    expect(getPayerRequestInfo(req).ipAddress).toBe('203.0.113.7')
  })

  it('unmaps IPv4-mapped IPv6 addresses', () => {
    const req = buildReq({ ip: '::ffff:203.0.113.7' })

    expect(getPayerRequestInfo(req).ipAddress).toBe('203.0.113.7')
  })

  it('accepts IPv6 addresses', () => {
    const req = buildReq({ ip: '2001:db8::1' })

    expect(getPayerRequestInfo(req).ipAddress).toBe('2001:db8::1')
  })

  it('omits the IP when no candidate parses as an IP', () => {
    const garbage = buildReq({
      headers: { 'x-forwarded-for': 'not-an-ip, also-not-an-ip' },
    })
    const empty = buildReq({})

    expect(getPayerRequestInfo(garbage).ipAddress).toBeUndefined()
    expect(getPayerRequestInfo(empty).ipAddress).toBeUndefined()
  })

  it('passes headers through and truncates them to the gateway limit', () => {
    const req = buildReq({
      headers: {
        'user-agent': 'a'.repeat(3000),
        accept: 'text/html,application/xhtml+xml',
      },
    })

    const info = getPayerRequestInfo(req)

    expect(info.userAgent).toHaveLength(2048)
    expect(info.acceptHeader).toBe('text/html,application/xhtml+xml')
  })

  it('uses the first value of repeated headers', () => {
    const req = buildReq({
      headers: { 'user-agent': ['Mozilla/5.0', 'Other/1.0'] },
    })

    expect(getPayerRequestInfo(req).userAgent).toBe('Mozilla/5.0')
  })
})
