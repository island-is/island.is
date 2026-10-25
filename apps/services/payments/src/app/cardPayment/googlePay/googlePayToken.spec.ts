import {
  createGooglePaySender,
  generateP256,
  signBase64,
  toPkcs8Pem,
} from '../test/googlePayTokens'
import { verifyAndDecryptGooglePayToken } from './googlePayToken'

const RECIPIENT_ID = 'merchant:12345678901234567890'
const NOW = Date.UTC(2026, 9, 23, 12, 0, 0)
const HOUR_MS = 60 * 60 * 1000

const {
  merchant,
  rootKeys: ROOT_KEYS,
  cryptogramPlaintext,
  encrypt,
  seal,
} = createGooglePaySender({ now: NOW, recipientId: RECIPIENT_ID })
const previousMerchant = generateP256()

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
    const token = seal({ signedFor: 'merchant:99999999999999999999' })

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
