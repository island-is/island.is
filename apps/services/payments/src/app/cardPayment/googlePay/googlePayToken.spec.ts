import crypto from 'crypto'

import {
  GooglePayRootSigningKey,
  verifyAndDecryptGooglePayToken,
} from './googlePayToken'

const RECIPIENT_ID = 'merchant:12345678901234567890'
const NOW = Date.UTC(2026, 9, 23, 12, 0, 0)
const HOUR_MS = 60 * 60 * 1000

const generateP256 = () =>
  crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })

const toSpkiBase64 = (key: crypto.KeyObject): string =>
  key.export({ format: 'der', type: 'spki' }).toString('base64')

const toPkcs8Pem = (key: crypto.KeyObject): string =>
  key.export({ format: 'pem', type: 'pkcs8' }) as string

const toLengthValue = (...parts: string[]): Buffer =>
  Buffer.concat(
    parts.flatMap((part) => {
      const bytes = Buffer.from(part, 'utf8')
      const length = Buffer.alloc(4)
      length.writeUInt32LE(bytes.length)
      return [length, bytes]
    }),
  )

const signBase64 = (privateKey: crypto.KeyObject, data: Buffer): string =>
  crypto.sign('sha256', data, privateKey).toString('base64')

const root = generateP256()
const intermediate = generateP256()
const merchant = generateP256()
const previousMerchant = generateP256()

const ROOT_KEYS: GooglePayRootSigningKey[] = [
  {
    keyValue: toSpkiBase64(root.publicKey),
    protocolVersion: 'ECv2',
    keyExpiration: String(NOW + 24 * HOUR_MS),
  },
]

const cryptogramPlaintext = (overrides: Record<string, unknown> = {}) => ({
  messageExpiration: String(NOW + HOUR_MS),
  messageId: 'AH2EjtfmrQ',
  paymentMethod: 'CARD',
  paymentMethodDetails: {
    pan: '4111111111111111',
    expirationMonth: 12,
    expirationYear: 2030,
    authMethod: 'CRYPTOGRAM_3DS',
    cryptogram: 'AAAAAA0ZfXkAAAAAAAAAAAAAAAA=',
    eciIndicator: '05',
  },
  ...overrides,
})

const encrypt = (
  plaintext: string,
  recipientPublicKey: crypto.KeyObject,
): string => {
  const ephemeral = generateP256()
  const jwk = ephemeral.publicKey.export({ format: 'jwk' })
  const ephemeralPoint = Buffer.concat([
    Buffer.from([0x04]),
    Buffer.from(jwk.x as string, 'base64url'),
    Buffer.from(jwk.y as string, 'base64url'),
  ])
  const sharedSecret = crypto.diffieHellman({
    privateKey: ephemeral.privateKey,
    publicKey: recipientPublicKey,
  })
  const derived = Buffer.from(
    crypto.hkdfSync(
      'sha256',
      Buffer.concat([ephemeralPoint, sharedSecret]),
      Buffer.alloc(0),
      Buffer.from('Google'),
      64,
    ),
  )
  const cipher = crypto.createCipheriv(
    'aes-256-ctr',
    derived.subarray(0, 32),
    Buffer.alloc(16, 0),
  )
  const encryptedMessage = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = crypto
    .createHmac('sha256', derived.subarray(32))
    .update(encryptedMessage)
    .digest()
  return JSON.stringify({
    encryptedMessage: encryptedMessage.toString('base64'),
    ephemeralPublicKey: ephemeralPoint.toString('base64'),
    tag: tag.toString('base64'),
  })
}

// Sender side of ECv2, as Google produces it (Tink PaymentMethodTokenSender).
const seal = ({
  plaintext = cryptogramPlaintext(),
  recipientPublicKey = merchant.publicKey,
  rootPrivateKey = root.privateKey,
  intermediateKeyExpiration = NOW + 12 * HOUR_MS,
  recipientId = RECIPIENT_ID,
  signedMessage,
}: {
  plaintext?: unknown
  recipientPublicKey?: crypto.KeyObject
  rootPrivateKey?: crypto.KeyObject
  intermediateKeyExpiration?: number
  recipientId?: string
  signedMessage?: string
} = {}): Record<string, unknown> => {
  const signedKey = JSON.stringify({
    keyValue: toSpkiBase64(intermediate.publicKey),
    keyExpiration: String(intermediateKeyExpiration),
  })
  const message =
    signedMessage ?? encrypt(JSON.stringify(plaintext), recipientPublicKey)
  return {
    protocolVersion: 'ECv2',
    signature: signBase64(
      intermediate.privateKey,
      toLengthValue('Google', recipientId, 'ECv2', message),
    ),
    intermediateSigningKey: {
      signedKey,
      signatures: [
        signBase64(rootPrivateKey, toLengthValue('Google', 'ECv2', signedKey)),
      ],
    },
    signedMessage: message,
  }
}

const decrypt = (
  token: Record<string, unknown>,
  overrides: Partial<Parameters<typeof verifyAndDecryptGooglePayToken>[0]> = {},
) =>
  verifyAndDecryptGooglePayToken({
    token: JSON.stringify(token),
    privateKeys: [toPkcs8Pem(merchant.privateKey)],
    rootKeys: ROOT_KEYS,
    recipientId: RECIPIENT_ID,
    now: NOW,
    ...overrides,
  })

describe('verifyAndDecryptGooglePayToken', () => {
  it('decrypts a CRYPTOGRAM_3DS token', () => {
    expect(decrypt(seal())).toEqual({
      messageId: 'AH2EjtfmrQ',
      messageExpiration: NOW + HOUR_MS,
      paymentMethodDetails: {
        pan: '4111111111111111',
        expirationMonth: 12,
        expirationYear: 2030,
        authMethod: 'CRYPTOGRAM_3DS',
        cryptogram: 'AAAAAA0ZfXkAAAAAAAAAAAAAAAA=',
        eciIndicator: '05',
      },
    })
  })

  it('decrypts a PAN_ONLY token, which has no cryptogram', () => {
    const plaintext = cryptogramPlaintext({
      paymentMethodDetails: {
        pan: '5555555555554444',
        expirationMonth: 1,
        expirationYear: 2029,
        authMethod: 'PAN_ONLY',
      },
    })

    expect(decrypt(seal({ plaintext })).paymentMethodDetails).toEqual({
      pan: '5555555555554444',
      expirationMonth: 1,
      expirationYear: 2029,
      authMethod: 'PAN_ONLY',
    })
  })

  it('decrypts a token encrypted to the previous key during a rotation', () => {
    const token = seal({ recipientPublicKey: previousMerchant.publicKey })

    const result = decrypt(token, {
      privateKeys: [
        toPkcs8Pem(merchant.privateKey),
        toPkcs8Pem(previousMerchant.privateKey),
      ],
    })

    expect(result.paymentMethodDetails.pan).toBe('4111111111111111')
  })

  it('rejects a token encrypted to a key we do not hold', () => {
    const token = seal({ recipientPublicKey: previousMerchant.publicKey })

    expect(() => decrypt(token)).toThrow('[stage=mac]')
  })

  it('accepts the intermediate key when any one of its signatures verifies', () => {
    const token = seal()
    const intermediateSigningKey = token.intermediateSigningKey as {
      signatures: string[]
    }
    intermediateSigningKey.signatures.unshift(
      signBase64(generateP256().privateKey, Buffer.from('unrelated')),
    )

    expect(decrypt(token).messageId).toBe('AH2EjtfmrQ')
  })

  it('rejects an intermediate key signed by a key that is not a Google root', () => {
    const token = seal({ rootPrivateKey: generateP256().privateKey })

    expect(() => decrypt(token)).toThrow('[stage=intermediate-signature]')
  })

  it('rejects when every root key has expired', () => {
    const rootKeys = [{ ...ROOT_KEYS[0], keyExpiration: String(NOW - 1) }]

    expect(() => decrypt(seal(), { rootKeys })).toThrow('[stage=root-keys]')
  })

  it('ignores root keys for other protocol versions or without an expiry', () => {
    const rootKeys = [
      { ...ROOT_KEYS[0], protocolVersion: 'ECv1' },
      { keyValue: ROOT_KEYS[0].keyValue, protocolVersion: 'ECv2' },
    ]

    expect(() => decrypt(seal(), { rootKeys })).toThrow('[stage=root-keys]')
  })

  it('rejects an expired intermediate key', () => {
    const token = seal({ intermediateKeyExpiration: NOW - 1 })

    expect(() => decrypt(token)).toThrow('[stage=intermediate-expiry]')
  })

  it('rejects a token signed for another recipient', () => {
    const token = seal({ recipientId: 'merchant:99999999999999999999' })

    expect(() => decrypt(token)).toThrow('[stage=message-signature]')
  })

  it('rejects a signedMessage altered after signing', () => {
    const token = seal()
    const message = JSON.parse(token.signedMessage as string)
    token.signedMessage = JSON.stringify({
      ...message,
      tag: Buffer.alloc(32).toString('base64'),
    })

    expect(() => decrypt(token)).toThrow('[stage=message-signature]')
  })

  it('rejects ciphertext that does not match its tag even when signed', () => {
    const message = JSON.parse(encrypt('{}', merchant.publicKey))
    const signedMessage = JSON.stringify({
      ...message,
      encryptedMessage: Buffer.from('tampered').toString('base64'),
    })

    expect(() => decrypt(seal({ signedMessage }))).toThrow('[stage=mac]')
  })

  it('rejects an expired message', () => {
    const plaintext = cryptogramPlaintext({ messageExpiration: String(NOW) })

    expect(() => decrypt(seal({ plaintext }))).toThrow('[stage=message-expiry]')
  })

  it('rejects a CRYPTOGRAM_3DS token without a cryptogram', () => {
    const plaintext = cryptogramPlaintext({
      paymentMethodDetails: {
        pan: '4111111111111111',
        expirationMonth: 12,
        expirationYear: 2030,
        authMethod: 'CRYPTOGRAM_3DS',
      },
    })

    expect(() => decrypt(seal({ plaintext }))).toThrow(
      '[stage=parse-plaintext]',
    )
  })

  it('rejects unsupported protocol versions', () => {
    expect(() => decrypt({ ...seal(), protocolVersion: 'ECv1' })).toThrow(
      '[stage=version]',
    )
  })

  it('rejects an envelope with members beyond the ECv2 set', () => {
    expect(() => decrypt({ ...seal(), extra: 'member' })).toThrow(
      '[stage=parse-token]',
    )
  })

  it('rejects a token that is not JSON', () => {
    expect(() =>
      verifyAndDecryptGooglePayToken({
        token: 'not json',
        privateKeys: [toPkcs8Pem(merchant.privateKey)],
        rootKeys: ROOT_KEYS,
        recipientId: RECIPIENT_ID,
        now: NOW,
      }),
    ).toThrow('[stage=parse-token]')
  })

  it('never puts card data in the error for a rejected plaintext', () => {
    const plaintext = cryptogramPlaintext({
      paymentMethodDetails: {
        pan: '4111111111111111',
        expirationMonth: 13,
        expirationYear: 2030,
        authMethod: 'PAN_ONLY',
      },
    })

    let message = ''
    try {
      decrypt(seal({ plaintext }))
    } catch (e) {
      message = (e as Error).message
    }

    expect(message).toContain('[stage=parse-plaintext]')
    expect(message).toContain('paymentMethodDetails.expirationMonth')
    expect(message).not.toContain('4111')
  })
})
