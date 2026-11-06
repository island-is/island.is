import { createHash, generateKeyPairSync, JsonWebKey, randomUUID } from 'crypto'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

import { JwtStrategy } from './jwt.strategy'
import { JwtPayload } from './jwt.payload'
import { jwkThumbprint } from './dpop'

const accessToken = 'header.payload.signature'
const url = 'https://api.island.is/api/graphql'

const createKey = () => {
  const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
  })
  const jwk = publicKey.export({ format: 'jwk' }) as JsonWebKey
  return { privateKey, jwk, thumbprint: jwkThumbprint(jwk) }
}

const proof = (
  key: ReturnType<typeof createKey>,
  overrides: Record<string, unknown> = {},
) =>
  jwt.sign(
    {
      jti: randomUUID(),
      htm: 'POST',
      htu: url,
      iat: Math.floor(Date.now() / 1000),
      ath: createHash('sha256').update(accessToken).digest('base64url'),
      ...overrides,
    },
    key.privateKey,
    {
      algorithm: 'ES256',
      header: { alg: 'ES256', typ: 'dpop+jwt', jwk: key.jwk } as jwt.JwtHeader,
    },
  )

const request = (authorization: string, dpop?: string) =>
  ({
    method: 'POST',
    protocol: 'http',
    originalUrl: '/api/graphql',
    headers: {
      authorization,
      host: 'api-service:4444',
      'x-forwarded-proto': 'https',
      'x-forwarded-host': 'api.island.is',
      ...(dpop && { dpop }),
    },
    ip: '1.1.1.1',
  } as unknown as Request)

describe('JwtStrategy DPoP', () => {
  const key = createKey()
  const boundPayload: JwtPayload = {
    sub: 'sub',
    nationalId: '1234567890',
    scope: ['scope'],
    client_id: '@island.is/app',
    cnf: { jkt: key.thumbprint },
  }

  const strategy = (requireDpopForBoundTokens = false) =>
    new JwtStrategy({ issuer: 'issuer', requireDpopForBoundTokens })

  it('accepts a bound token with a proof from its key, and forwards it as Bearer', async () => {
    const auth = await strategy().validate(
      request(`DPoP ${accessToken}`, proof(key)),
      boundPayload,
    )

    expect(auth.authorization).toBe(`Bearer ${accessToken}`)
    expect(auth.dpopJkt).toBe(key.thumbprint)
  })

  it('accepts a bound token as Bearer where proofs are not required', async () => {
    const auth = await strategy().validate(
      request(`Bearer ${accessToken}`),
      boundPayload,
    )

    expect(auth.authorization).toBe(`Bearer ${accessToken}`)
  })

  it('refuses a bound token as Bearer where proofs are required', async () => {
    await expect(
      strategy(true).validate(request(`Bearer ${accessToken}`), boundPayload),
    ).rejects.toThrow('DPoP-bound')
  })

  it('still accepts unbound tokens as Bearer where proofs are required', async () => {
    const { cnf: _, ...unbound } = boundPayload

    const auth = await strategy(true).validate(
      request(`Bearer ${accessToken}`),
      unbound,
    )

    expect(auth.dpopJkt).toBeUndefined()
  })

  it('refuses the DPoP scheme with an unbound token', async () => {
    const { cnf: _, ...unbound } = boundPayload

    await expect(
      strategy().validate(request(`DPoP ${accessToken}`, proof(key)), unbound),
    ).rejects.toThrow('DPoP-bound token')
  })

  it.each`
    case                       | makeProof
    ${'is missing'}            | ${() => undefined}
    ${'is from another key'}   | ${() => proof(createKey())}
    ${'is for another method'} | ${() => proof(key, { htm: 'GET' })}
    ${'is for another URL'}    | ${() => proof(key, { htu: 'https://api.island.is/other' })}
    ${'is for another token'}  | ${() => proof(key, { ath: 'other' })}
    ${'is stale'}              | ${() => proof(key, { iat: Math.floor(Date.now() / 1000) - 300 })}
  `('refuses a proof that $case', async ({ makeProof }) => {
    await expect(
      strategy().validate(
        request(`DPoP ${accessToken}`, makeProof()),
        boundPayload,
      ),
    ).rejects.toThrow()
  })

  it('refuses a proof used twice', async () => {
    const jwtStrategy = strategy()
    const used = proof(key)
    await jwtStrategy.validate(
      request(`DPoP ${accessToken}`, used),
      boundPayload,
    )

    await expect(
      jwtStrategy.validate(request(`DPoP ${accessToken}`, used), boundPayload),
    ).rejects.toThrow('already used')
  })

  it('refuses a JWT that is not an access token, like a client attestation', async () => {
    const attestation = jwt.sign({ sub: '@island.is/app' }, 'secret', {
      header: { alg: 'HS256', typ: 'oauth-client-attestation+jwt' },
    })

    await expect(
      strategy().validate(request(`Bearer ${attestation}`), boundPayload),
    ).rejects.toThrow('Not an access token')
  })

  it('refuses an authorization header with more than a scheme and a token', async () => {
    const attestation = jwt.sign({ sub: '@island.is/app' }, 'secret', {
      header: { alg: 'HS256', typ: 'oauth-client-attestation+jwt' },
    })

    await expect(
      strategy().validate(request(`Bearer ${attestation} x`), boundPayload),
    ).rejects.toThrow('Malformed authorization header')
  })

  it('accepts one request validated more than once, as GraphQL guards do per field', async () => {
    const jwtStrategy = strategy()
    const sameRequest = request(`DPoP ${accessToken}`, proof(key))
    await jwtStrategy.validate(sameRequest, boundPayload)

    await expect(
      jwtStrategy.validate(sameRequest, boundPayload),
    ).resolves.toBeDefined()
  })

  it('ignores the query string when matching the URL', async () => {
    const withQuery = {
      ...request(`DPoP ${accessToken}`, proof(key)),
      originalUrl: '/api/graphql?op=x',
    } as Request

    await expect(
      strategy().validate(withQuery, boundPayload),
    ).resolves.toBeDefined()
  })
})
