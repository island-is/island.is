import { createPrivateKey, generateKeyPairSync } from 'crypto'
import * as jwt from 'jsonwebtoken'

import { generatePayloadHash, generateWebhookJwt } from './webhookAuth.utils'

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
})

const temporaryPrivateKey = createPrivateKey({
  key: privateKey,
  type: 'pkcs1',
  format: 'pem',
})

describe('webhookAuth.utils', () => {
  it('should generate a valid JWT', () => {
    const payload = {
      message: 'test',
    }

    const expectedPayloadHash = generatePayloadHash(payload)

    const jwtToken = generateWebhookJwt(
      {
        id: '123',
        onUpdateUrl: 'https://example.com',
      },
      { type: 'update' },
      payload,
      {
        privateKey: temporaryPrivateKey
          .export({ type: 'pkcs1', format: 'pem' })
          .toString(),
        keyId: 'test',
        issuer: 'test',
        expiresInMinutes: 10,
      },
    )

    expect(jwtToken).toBeDefined()
    expect(jwtToken.length).toBeGreaterThan(0)
    const decoded = jwt.verify(
      jwtToken,
      temporaryPrivateKey.export({ type: 'pkcs1', format: 'pem' }),
    ) as {
      sub: string
      event_type: string
      payload_hash: string
    }
    expect(decoded).toBeDefined()
    expect(decoded.sub).toBe('123')
    expect(decoded.event_type).toBe('update')
    expect(decoded.payload_hash).toBe(expectedPayloadHash)
  })
})
