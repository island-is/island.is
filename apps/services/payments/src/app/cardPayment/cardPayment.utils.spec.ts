import crypto from 'crypto'

import {
  buildVerificationBrowserData,
  buildVerificationCardholderData,
  decryptApplePayPaymentToken,
  deriveApplePaySymmetricKey,
  generateVerificationRequestOptions,
} from './cardPayment.utils'
import { CardPaymentModuleConfigType } from './cardPayment.config'
import { VerifyCardInput } from './dtos/verifyCard.input'

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

describe('buildVerificationBrowserData', () => {
  const validBrowserInfo = {
    ipAddress: '203.0.113.7',
    screenHeight: 1080,
    screenWidth: 1920,
  }

  it('returns undefined without browser info', () => {
    expect(buildVerificationBrowserData(undefined)).toBeUndefined()
  })

  it('returns undefined when a gateway-required member is missing or invalid', () => {
    expect(
      buildVerificationBrowserData({ ...validBrowserInfo, ipAddress: '' }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        screenHeight: 1080.5,
      }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({ ...validBrowserInfo, screenWidth: -1 }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        screenHeight: 1_000_000,
      }),
    ).toBeUndefined()
  })

  it('returns undefined for values that do not parse as an IP address', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: 'not-an-ip',
      }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: '999.999.1.1',
      }),
    ).toBeUndefined()
  })

  it('accepts IPv6 addresses', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: '2001:db8::1',
      }),
    ).toMatchObject({ ip: '2001:db8::1' })
  })

  it('builds the minimal gateway object from the required members', () => {
    expect(buildVerificationBrowserData(validBrowserInfo)).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
    })
  })

  it('passes through valid optional members', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        colorDepth: 24,
        timeZoneOffset: -60,
        language: 'en-GB',
        userAgent: 'Mozilla/5.0',
        acceptHeader: 'application/json',
        javaEnabled: true,
      }),
    ).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: true,
      colorDepth: 24,
      timeZoneOffset: -60,
      language: 'en-GB',
      userAgent: 'Mozilla/5.0',
      acceptHeader: 'application/json',
    })
  })

  it('omits optional members the gateway would reject instead of remapping them', () => {
    const result = buildVerificationBrowserData({
      ...validBrowserInfo,
      // 30 bits per pixel (e.g. HDR displays) is not an accepted gateway value.
      colorDepth: 30,
      timeZoneOffset: 100_000,
      language: 'not/a/valid/language/tag',
    })

    expect(result).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
    })
  })
})

describe('buildVerificationCardholderData', () => {
  it('returns undefined for missing or out-of-range names', () => {
    expect(buildVerificationCardholderData(undefined)).toBeUndefined()
    expect(buildVerificationCardholderData('')).toBeUndefined()
    expect(buildVerificationCardholderData('  J  ')).toBeUndefined()
    // 46 characters: omitted, never truncated into a different name.
    expect(buildVerificationCardholderData('J'.repeat(46))).toBeUndefined()
  })

  it('trims and passes through a valid name', () => {
    expect(buildVerificationCardholderData(' Jón Jónsson ')).toEqual({
      cardholderName: 'Jón Jónsson',
    })
    expect(buildVerificationCardholderData('J'.repeat(45))).toEqual({
      cardholderName: 'J'.repeat(45),
    })
  })
})

describe('generateVerificationRequestOptions', () => {
  const paymentApiConfig = {
    paymentsApiSecret: 'secret',
    paymentsApiHeaderKey: 'valitorpay-api-version',
    paymentsApiHeaderValue: '2.0',
    systemCalling: 'island-is',
  } as CardPaymentModuleConfigType['paymentGateway']

  const baseInput = {
    paymentFlowId: 'flow-1',
    cardNumber: '4111111111111111',
    expiryMonth: 12,
    expiryYear: 30,
  }

  const generate = (verifyCardInput: VerifyCardInput) =>
    JSON.parse(
      generateVerificationRequestOptions({
        verifyCardInput,
        md: 'test-md',
        paymentApiConfig,
        webOrigin: 'https://island.is/greida',
        amount: 100,
      }).body as string,
    )

  it('sends the request without 3DS objects when the client did not supply them', () => {
    const body = generate(baseInput)

    expect(body).toEqual({
      cardNumber: '4111111111111111',
      expirationMonth: 12,
      expirationYear: 2030,
      cardholderDeviceType: 'WWW',
      amount: 10000,
      currency: 'ISK',
      authenticationUrl: 'https://island.is/greida/api/card/callback',
      MD: 'test-md',
      systemCalling: 'island-is',
    })
    expect(body).not.toHaveProperty('browserData')
    expect(body).not.toHaveProperty('cardHolderData')
  })

  it('includes browserData and cardHolderData when the client supplied valid 3DS data', () => {
    const body = generate({
      ...baseInput,
      cardholderName: 'Jón Jónsson',
      browserInfo: {
        ipAddress: '203.0.113.7',
        screenHeight: 1080,
        screenWidth: 1920,
        language: 'is',
      },
    })

    expect(body.browserData).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
      language: 'is',
    })
    expect(body.cardHolderData).toEqual({ cardholderName: 'Jón Jónsson' })
  })

  it('omits invalid 3DS data rather than failing or altering the request base', () => {
    const body = generate({
      ...baseInput,
      cardholderName: 'J',
      browserInfo: {
        ipAddress: '',
        screenHeight: 1080,
        screenWidth: 1920,
      },
    })

    expect(body).not.toHaveProperty('browserData')
    expect(body).not.toHaveProperty('cardHolderData')
    expect(body.cardNumber).toBe('4111111111111111')
  })
})
