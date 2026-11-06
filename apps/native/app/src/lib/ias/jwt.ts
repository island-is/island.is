import type { DevicePublicJwk } from '../../../modules/device-keys'

/** Signs the UTF-8 bytes of `data`: ES256, base64url r||s. */
export type Sign = (data: string) => Promise<string>

export function base64url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const encodeJson = (value: unknown) =>
  base64url(new TextEncoder().encode(JSON.stringify(value)))

export const now = () => Math.floor(Date.now() / 1000)

export async function signJwt(
  sign: Sign,
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
): Promise<string> {
  const signingInput = `${encodeJson({
    alg: 'ES256',
    ...header,
  })}.${encodeJson(payload)}`
  return `${signingInput}.${await sign(signingInput)}`
}

/** OAuth-Client-Attestation-PoP, fresh for every request. */
export function attestationPop(
  sign: Sign,
  claims: { clientId: string; issuer: string; jti: string },
): Promise<string> {
  return signJwt(
    sign,
    { typ: 'oauth-client-attestation-pop+jwt' },
    { iss: claims.clientId, aud: claims.issuer, jti: claims.jti, iat: now() },
  )
}

/**
 * DPoP proof (RFC 9449). `htu` is the URL without its query or fragment, and
 * `ath` binds the proof to the access token sent with it.
 */
export function dpopProof(
  sign: Sign,
  claims: {
    jwk: DevicePublicJwk
    method: string
    url: string
    jti: string
    ath?: string
    nonce?: string
  },
): Promise<string> {
  const payload: Record<string, unknown> = {
    jti: claims.jti,
    htm: claims.method.toUpperCase(),
    htu: claims.url.split(/[?#]/)[0],
    iat: now(),
  }
  if (claims.ath) {
    payload.ath = claims.ath
  }
  if (claims.nonce) {
    payload.nonce = claims.nonce
  }
  return signJwt(sign, { typ: 'dpop+jwt', jwk: claims.jwk }, payload)
}

/** The biometric unlock assertion. Signing it shows the biometric prompt. */
export function deviceKeyAssertion(
  sign: Sign,
  claims: {
    clientId: string
    issuer: string
    nonce: string
    installJkt: string
  },
): Promise<string> {
  return signJwt(
    sign,
    { typ: 'device-key+jwt' },
    {
      iss: claims.clientId,
      aud: claims.issuer,
      purpose: 'device-key-unlock',
      nonce: claims.nonce,
      install_jkt: claims.installJkt,
      iat: now(),
    },
  )
}
