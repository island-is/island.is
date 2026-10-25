import crypto from 'crypto'

import { GOOGLE_PAY_TEST_RECIPIENT_ID } from '../googlePay/googlePay.constants'
import type { GooglePayRootSigningKey } from '../googlePay/googlePayToken'

const HOUR_MS = 60 * 60 * 1000

export const generateP256 = () =>
  crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })

export const toSpkiBase64 = (key: crypto.KeyObject): string =>
  key.export({ format: 'der', type: 'spki' }).toString('base64')

export const toPkcs8Pem = (key: crypto.KeyObject): string =>
  key.export({ format: 'pem', type: 'pkcs8' }) as string

export const signBase64 = (
  privateKey: crypto.KeyObject,
  data: Buffer,
): string => crypto.sign('sha256', data, privateKey).toString('base64')

const toLengthValue = (...parts: string[]): Buffer =>
  Buffer.concat(
    parts.flatMap((part) => {
      const bytes = Buffer.from(part, 'utf8')
      const length = Buffer.alloc(4)
      length.writeUInt32LE(bytes.length)
      return [length, bytes]
    }),
  )

/**
 * The sender side of Google Pay ECv2, as Google produces it (Tink
 * PaymentMethodTokenSender), with its own root, intermediate and merchant
 * keys. Tokens are valid at `now`.
 */
export const createGooglePaySender = ({
  now = Date.now(),
  recipientId = GOOGLE_PAY_TEST_RECIPIENT_ID,
}: { now?: number; recipientId?: string } = {}) => {
  const root = generateP256()
  const intermediate = generateP256()
  const merchant = generateP256()

  const rootKeys: GooglePayRootSigningKey[] = [
    {
      keyValue: toSpkiBase64(root.publicKey),
      protocolVersion: 'ECv2',
      keyExpiration: String(now + 24 * HOUR_MS),
    },
  ]

  const cryptogramPlaintext = (overrides: Record<string, unknown> = {}) => ({
    messageExpiration: String(now + HOUR_MS),
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
    recipientPublicKey: crypto.KeyObject = merchant.publicKey,
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

  const seal = ({
    plaintext = cryptogramPlaintext(),
    recipientPublicKey = merchant.publicKey,
    rootPrivateKey = root.privateKey,
    intermediateKeyExpiration = now + 12 * HOUR_MS,
    signedFor = recipientId,
    signedMessage,
  }: {
    plaintext?: unknown
    recipientPublicKey?: crypto.KeyObject
    rootPrivateKey?: crypto.KeyObject
    intermediateKeyExpiration?: number
    signedFor?: string
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
        toLengthValue('Google', signedFor, 'ECv2', message),
      ),
      intermediateSigningKey: {
        signedKey,
        signatures: [
          signBase64(
            rootPrivateKey,
            toLengthValue('Google', 'ECv2', signedKey),
          ),
        ],
      },
      signedMessage: message,
    }
  }

  return { merchant, rootKeys, cryptogramPlaintext, encrypt, seal }
}
