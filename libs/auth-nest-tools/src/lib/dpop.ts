import { createHash, createPublicKey, JsonWebKey } from 'crypto'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

const PROOF_ALGORITHMS: jwt.Algorithm[] = ['ES256', 'RS256', 'PS256']
const PROOF_LIFETIME_SECONDS = 60
const MAX_REMEMBERED_PROOFS = 10_000

export class DpopError extends Error {}

const base64url = (data: Buffer) => data.toString('base64url')

/** RFC 7638 thumbprint of a public JWK. */
export const jwkThumbprint = (jwk: JsonWebKey): string => {
  const members =
    jwk.kty === 'EC'
      ? { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y }
      : { e: jwk.e, kty: jwk.kty, n: jwk.n }

  return base64url(
    createHash('sha256').update(JSON.stringify(members)).digest(),
  )
}

/**
 * The URL the client called, as it sees it: behind the ingress the request
 * arrives on an internal host, so the forwarded host and protocol win.
 */
const requestUrl = (request: Request): string => {
  const forwardedProto = request.headers['x-forwarded-proto']
  const forwardedHost = request.headers['x-forwarded-host']
  const proto =
    (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto)
      ?.split(',')[0]
      .trim() ?? request.protocol
  const host =
    (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost)
      ?.split(',')[0]
      .trim() ?? request.headers.host
  const path = (request.originalUrl ?? request.url ?? '').split('?')[0]

  return `${proto}://${host}${path}`
}

const sameUrl = (a: string, b: string): boolean => {
  try {
    const left = new URL(a)
    const right = new URL(b)
    return (
      left.protocol === right.protocol &&
      left.host.toLowerCase() === right.host.toLowerCase() &&
      left.pathname === right.pathname
    )
  } catch {
    return false
  }
}

/**
 * Proofs seen recently, by jti. Per instance: a proof replayed to another
 * replica within its minute isn't caught here.
 */
export class DpopReplayCache {
  private readonly seen = new Map<string, number>()

  /** False when the jti was already used. */
  use(jti: string, now: number): boolean {
    for (const [key, expires] of this.seen) {
      if (expires > now && this.seen.size < MAX_REMEMBERED_PROOFS) break
      this.seen.delete(key)
    }

    if (this.seen.has(jti)) return false
    this.seen.set(jti, now + PROOF_LIFETIME_SECONDS * 2)
    return true
  }
}

/**
 * Verifies a DPoP proof (RFC 9449) for a request carrying an access token bound
 * to the proof's key.
 */
export const verifyDpopProof = ({
  request,
  accessToken,
  boundKey,
  replayCache,
  now = Math.floor(Date.now() / 1000),
}: {
  request: Request
  accessToken: string
  boundKey: string
  replayCache: DpopReplayCache
  now?: number
}): void => {
  const header = request.headers['dpop']
  if (typeof header !== 'string' || header.length === 0) {
    throw new DpopError('Missing DPoP proof')
  }

  const decoded = jwt.decode(header, { complete: true })
  if (!decoded || typeof decoded.payload === 'string') {
    throw new DpopError('DPoP proof is not a JWT')
  }

  const { typ, jwk } = decoded.header as jwt.JwtHeader & { jwk?: JsonWebKey }
  if (typ !== 'dpop+jwt' || !jwk || jwk.d) {
    throw new DpopError('DPoP proof must be a dpop+jwt with a public jwk')
  }

  if (jwkThumbprint(jwk) !== boundKey) {
    throw new DpopError('DPoP proof is not from the key the token is bound to')
  }

  let payload: jwt.JwtPayload
  try {
    payload = jwt.verify(header, createPublicKey({ key: jwk, format: 'jwk' }), {
      algorithms: PROOF_ALGORITHMS,
      ignoreExpiration: true,
    }) as jwt.JwtPayload
  } catch {
    throw new DpopError('DPoP proof signature is not valid')
  }

  if (payload.htm !== request.method) {
    throw new DpopError('DPoP proof is for another method')
  }

  if (
    typeof payload.htu !== 'string' ||
    !sameUrl(payload.htu, requestUrl(request))
  ) {
    throw new DpopError('DPoP proof is for another URL')
  }

  if (
    typeof payload.iat !== 'number' ||
    Math.abs(now - payload.iat) > PROOF_LIFETIME_SECONDS
  ) {
    throw new DpopError('DPoP proof is not fresh')
  }

  const ath = base64url(createHash('sha256').update(accessToken).digest())
  if (payload.ath !== ath) {
    throw new DpopError('DPoP proof is for another access token')
  }

  if (
    typeof payload.jti !== 'string' ||
    !replayCache.use(`${boundKey}:${payload.jti}`, now)
  ) {
    throw new DpopError('DPoP proof was already used')
  }
}
