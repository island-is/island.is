import {
  createHash,
  createHmac,
  createPublicKey,
  JsonWebKey,
  timingSafeEqual,
} from 'crypto'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

const PROOF_ALGORITHMS: jwt.Algorithm[] = ['ES256', 'RS256', 'PS256']
const NONCE_LIFETIME_SECONDS = 300
/** How far ahead of this instance another instance's clock may be. */
const SERVER_CLOCK_SKEW_SECONDS = 5
const MAX_REMEMBERED_PROOFS = 50_000

export class DpopError extends Error {}

/** The proof has no server nonce, or an expired one: the client retries with a new one. */
export class DpopNonceError extends DpopError {}

/**
 * The server nonce a client puts in its proofs (RFC 9449, section 9), so a proof
 * is fresh by our clock and the phone's clock doesn't matter. The nonce is the
 * time it was issued, so nothing is stored and any instance can check it. With
 * a secret shared by the instances it is also signed, so a client can't make
 * its own; without one it is as strong as the iat check it replaces.
 */
export class DpopNonces {
  constructor(private readonly secret?: string) {}

  create(now = Math.floor(Date.now() / 1000)): string {
    const issued = String(now)
    return this.secret ? `${issued}.${this.sign(issued)}` : issued
  }

  isFresh(nonce: unknown, now = Math.floor(Date.now() / 1000)): boolean {
    if (typeof nonce !== 'string' || nonce.length > 100) return false

    const [issued, signature, ...rest] = nonce.split('.')
    if (!/^\d{1,12}$/.test(issued) || rest.length > 0) return false

    if (this.secret) {
      const expected = Buffer.from(this.sign(issued))
      const actual = Buffer.from(signature ?? '')
      if (
        actual.length !== expected.length ||
        !timingSafeEqual(actual, expected)
      ) {
        return false
      }
    } else if (signature !== undefined) {
      return false
    }

    const age = now - Number(issued)
    return (
      age >= -SERVER_CLOCK_SKEW_SECONDS &&
      age <= NONCE_LIFETIME_SECONDS + SERVER_CLOCK_SKEW_SECONDS
    )
  }

  private sign(issued: string): string {
    return createHmac('sha256', this.secret as string)
      .update(`dpop-nonce:${issued}`)
      .digest('base64url')
  }
}

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
 * Proofs seen recently, by jti, for as long as their nonce could be accepted.
 * Per instance: a proof replayed to another replica in that time isn't caught here.
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
    this.seen.set(
      jti,
      now + NONCE_LIFETIME_SECONDS + SERVER_CLOCK_SKEW_SECONDS * 2,
    )
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
  nonces,
  now = Math.floor(Date.now() / 1000),
}: {
  request: Request
  accessToken: string
  boundKey: string
  replayCache: DpopReplayCache
  nonces: DpopNonces
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

  const ath = base64url(createHash('sha256').update(accessToken).digest())
  if (payload.ath !== ath) {
    throw new DpopError('DPoP proof is for another access token')
  }

  // Last of the checks on the proof itself, so only the token's holder is told to retry.
  if (!nonces.isFresh(payload.nonce, now)) {
    throw new DpopNonceError(
      'DPoP proof needs the nonce from the DPoP-Nonce header',
    )
  }

  if (
    typeof payload.jti !== 'string' ||
    !replayCache.use(`${boundKey}:${payload.jti}`, now)
  ) {
    throw new DpopError('DPoP proof was already used')
  }
}
