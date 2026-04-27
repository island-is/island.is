import crypto from 'crypto'

import {
  decryptApplePayPaymentToken,
  deriveApplePaySymmetricKey,
} from './cardPayment.utils'

const MERCHANT_ID = 'merchant.com.island.test'

const buildSyntheticEcV1Token = ({
  merchantPrivatePem,
  ephemeralPublicKeySpkiDer,
  merchantIdentifier,
  plaintextPayload,
}: {
  merchantPrivatePem: string
  ephemeralPublicKeySpkiDer: Buffer
  merchantIdentifier: string
  plaintextPayload: Record<string, unknown>
}) => {
  const ephemeralPublicKey = crypto.createPublicKey({
    key: ephemeralPublicKeySpkiDer,
    format: 'der',
    type: 'spki',
  })
  const merchantPrivateKey = crypto.createPrivateKey({
    key: merchantPrivatePem,
    format: 'pem',
  })

  const sharedSecret = crypto.diffieHellman({
    privateKey: merchantPrivateKey,
    publicKey: ephemeralPublicKey,
  })

  const aesKey = Uint8Array.from(
    deriveApplePaySymmetricKey(sharedSecret, merchantIdentifier),
  )

  const iv = Uint8Array.from(Buffer.alloc(16, 0))
  const plaintext = JSON.stringify(plaintextPayload)
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv)
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()
  const data = Buffer.concat([ciphertext, authTag]).toString('base64')

  return {
    version: 'EC_v1' as const,
    data,
    signature: 'dGVzdA==',
    header: {
      ephemeralPublicKey: ephemeralPublicKeySpkiDer.toString('base64'),
      publicKeyHash: 'dGVzdA==',
      transactionId: 'abc123',
    },
  }
}

describe('decryptApplePayPaymentToken', () => {
  it('round-trips a synthetic EC_v1 token (same KDF + AES-GCM as production)', () => {
    const ephemeral = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })

    const merchant = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })

    const plaintextPayload = {
      applicationPrimaryAccountNumber: '4111111111111111',
      applicationExpirationDate: '251231',
      paymentData: {
        onlinePaymentCryptogram:
          Buffer.from('cryptogram-bytes').toString('base64'),
      },
    }

    const paymentData = buildSyntheticEcV1Token({
      merchantPrivatePem: merchant.privateKey,
      ephemeralPublicKeySpkiDer: ephemeral.publicKey as Buffer,
      merchantIdentifier: MERCHANT_ID,
      plaintextPayload,
    })

    const result = decryptApplePayPaymentToken({
      paymentData,
      paymentProcessingKey: merchant.privateKey,
      merchantIdentifier: MERCHANT_ID,
    })

    expect(result.cardNumber).toBe('4111111111111111')
    expect(result.expirationMonth).toBe(12)
    expect(result.expirationYear).toBe(2025)
    expect(result.paymentCryptogram).toBe(
      Buffer.from('cryptogram-bytes').toString('base64'),
    )
  })

  it('throws for unsupported token version', () => {
    expect(() =>
      decryptApplePayPaymentToken({
        paymentData: {
          version: 'RSA_v1',
          data: '',
          signature: '',
          header: {
            ephemeralPublicKey: '',
            publicKeyHash: '',
            transactionId: '',
          },
        },
        paymentProcessingKey:
          '-----BEGIN PRIVATE KEY-----\nMII\n-----END PRIVATE KEY-----\n',
        merchantIdentifier: MERCHANT_ID,
      }),
    ).toThrow(/Only EC_v1 is supported/)
  })

  it('throws for invalid PEM private key', () => {
    expect(() =>
      decryptApplePayPaymentToken({
        paymentData: {
          version: 'EC_v1',
          data: '',
          signature: '',
          header: {
            ephemeralPublicKey: '',
            publicKeyHash: '',
            transactionId: '',
          },
        },
        paymentProcessingKey: 'not valid pem',
        merchantIdentifier: MERCHANT_ID,
      }),
    ).toThrow(/load-processing-key/)
  })

  it('fails decrypt when merchant identifier does not match KDF Party V', () => {
    const ephemeral = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })

    const merchant = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })

    const paymentData = buildSyntheticEcV1Token({
      merchantPrivatePem: merchant.privateKey,
      ephemeralPublicKeySpkiDer: ephemeral.publicKey as Buffer,
      merchantIdentifier: MERCHANT_ID,
      plaintextPayload: {
        applicationPrimaryAccountNumber: '4111111111111111',
        applicationExpirationDate: '251231',
        paymentData: { onlinePaymentCryptogram: 'dGVzdA==' },
      },
    })

    expect(() =>
      decryptApplePayPaymentToken({
        paymentData,
        paymentProcessingKey: merchant.privateKey,
        merchantIdentifier: 'merchant.com.other',
      }),
    ).toThrow()
  })
})

describe('deriveApplePaySymmetricKey', () => {
  it('is deterministic for fixed shared secret and merchant ID', () => {
    const z = Buffer.alloc(32, 7)
    const a = deriveApplePaySymmetricKey(z, 'merchant.com.a')
    const b = deriveApplePaySymmetricKey(z, 'merchant.com.a')
    const c = deriveApplePaySymmetricKey(z, 'merchant.com.b')

    expect(a.toString('hex')).toBe(b.toString('hex'))
    expect(a.toString('hex')).not.toBe(c.toString('hex'))
    expect(a).toHaveLength(32)
  })
})
