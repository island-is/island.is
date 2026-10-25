import crypto from 'crypto'
import { z } from 'zod'

import { GOOGLE_PAY_SENDER_ID } from './googlePay.constants'

/**
 * Google Pay ECv2 payment method token verifier and decrypter.
 *
 * Implements the recipient side of Google's payment data cryptography:
 * https://developers.google.com/pay/api/web/guides/resources/payment-data-cryptography
 * with the same checks, in the same order, as Google's reference
 * implementation (Tink `PaymentMethodTokenRecipient`, protocol ECv2):
 *
 *   1. The token is exactly { protocolVersion, signature,
 *      intermediateSigningKey, signedMessage } and protocolVersion is ECv2.
 *   2. At least one of intermediateSigningKey.signatures verifies under a
 *      non-expired ECv2 root signing key, over the length-prefixed
 *      `Google || ECv2 || signedKey`.
 *   3. The intermediate key has not expired.
 *   4. signature verifies under the intermediate key, over the
 *      length-prefixed `Google || recipientId || ECv2 || signedMessage`.
 *   5. ECDH between our private key and the ephemeral public key,
 *      HKDF-SHA256 (IKM = ephemeralPublicKey || sharedSecret, empty salt,
 *      info `Google`) to 64 bytes: AES-256 key, then HMAC-SHA256 key.
 *   6. tag equals HMAC-SHA256(encryptedMessage), compared in constant time.
 *      Each configured private key is tried in turn so key rotation works.
 *   7. AES-256-CTR with a zero IV decrypts encryptedMessage.
 *   8. The plaintext has not passed messageExpiration.
 *
 * Errors carry a stage tag and never include card data.
 */

const PROTOCOL_VERSION = 'ECv2'
const HKDF_INFO = Buffer.from(GOOGLE_PAY_SENDER_ID, 'ascii')
const AES_KEY_BYTES = 32
const HMAC_KEY_BYTES = 32
const UNCOMPRESSED_P256_POINT_BYTES = 65

export interface GooglePayRootSigningKey {
  keyValue: string
  protocolVersion: string
  keyExpiration?: string
}

export interface GooglePayPaymentMethodDetails {
  pan: string
  expirationMonth: number
  expirationYear: number
  authMethod: 'PAN_ONLY' | 'CRYPTOGRAM_3DS'
  cryptogram?: string
  eciIndicator?: string
}

export interface GooglePayDecryptedToken {
  messageId: string
  messageExpiration: number
  paymentMethodDetails: GooglePayPaymentMethodDetails
}

const millisSchema = z.string().regex(/^\d+$/)

// Strict where Tink requires an exact member set; the signed key may grow.
const TokenSchema = z
  .object({
    protocolVersion: z.string(),
    signature: z.string(),
    intermediateSigningKey: z
      .object({
        signedKey: z.string(),
        signatures: z.array(z.string()).min(1),
      })
      .strict(),
    signedMessage: z.string(),
  })
  .strict()

const SignedKeySchema = z.object({
  keyValue: z.string(),
  keyExpiration: millisSchema,
})

const SignedMessageSchema = z
  .object({
    encryptedMessage: z.string(),
    ephemeralPublicKey: z.string(),
    tag: z.string(),
  })
  .strict()

const PlaintextSchema = z.object({
  messageExpiration: millisSchema,
  messageId: z.string().min(1),
  paymentMethod: z.literal('CARD'),
  paymentMethodDetails: z.object({
    pan: z.string().regex(/^\d+$/),
    expirationMonth: z.number().int().min(1).max(12),
    expirationYear: z.number().int(),
    authMethod: z.enum(['PAN_ONLY', 'CRYPTOGRAM_3DS']),
    cryptogram: z.string().optional(),
    eciIndicator: z.string().optional(),
  }),
})

const tokenError = (stage: string, message: string): Error =>
  new Error(`Google Pay token [stage=${stage}] ${message}`)

// Parses JSON and validates it, reporting only the failing paths so a
// rejected plaintext never puts card data into an error message.
const parseJson = <T>(stage: string, json: string, schema: z.ZodType<T>): T => {
  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw tokenError(stage, 'not valid JSON')
  }
  const result = schema.safeParse(value)
  if (!result.success) {
    const paths = result.error.issues
      .map((issue) => issue.path.join('.') || '(root)')
      .join(', ')
    throw tokenError(stage, `unexpected shape at ${paths}`)
  }
  return result.data
}

// Google's signed bytes: each component as a 4-byte little-endian length
// followed by its UTF-8 bytes.
const toLengthValue = (...parts: string[]): Buffer =>
  Buffer.concat(
    parts.flatMap((part) => {
      const bytes = Buffer.from(part, 'utf8')
      const length = Buffer.alloc(4)
      length.writeUInt32LE(bytes.length)
      return [length, bytes]
    }),
  )

const loadP256PublicKey = (spkiBase64: string): crypto.KeyObject => {
  const key = crypto.createPublicKey({
    key: Buffer.from(spkiBase64, 'base64'),
    format: 'der',
    type: 'spki',
  })
  if (key.asymmetricKeyDetails?.namedCurve !== 'prime256v1') {
    throw new Error('not a P-256 key')
  }
  return key
}

// ECDSA-SHA256 with DER-encoded signatures; a malformed signature is a
// failed verification, not an error.
const verifiesUnder = (
  key: crypto.KeyObject,
  data: Buffer,
  signatureBase64: string,
): boolean => {
  try {
    return crypto.verify(
      'sha256',
      data,
      key,
      Buffer.from(signatureBase64, 'base64'),
    )
  } catch {
    return false
  }
}

const timingSafeEqual = (a: Buffer, b: Buffer): boolean =>
  a.length === b.length && crypto.timingSafeEqual(a, b)

export const verifyAndDecryptGooglePayToken = ({
  token,
  privateKeys,
  rootKeys,
  recipientId,
  now = Date.now(),
}: {
  /** The tokenizationData.token string from pay.js, unmodified */
  token: string
  /** PEM private keys, current first; the previous one during a rotation */
  privateKeys: string[]
  rootKeys: GooglePayRootSigningKey[]
  /** `merchant:` plus the merchant id the token was encrypted for */
  recipientId: string
  now?: number
}): GooglePayDecryptedToken => {
  // ──────────────────────────────────────────────────────────────────
  // Step 1: envelope and protocol version.
  // ──────────────────────────────────────────────────────────────────
  const envelope = parseJson('parse-token', token, TokenSchema)
  if (envelope.protocolVersion !== PROTOCOL_VERSION) {
    throw tokenError(
      'version',
      `unsupported protocol version ${envelope.protocolVersion} (only ${PROTOCOL_VERSION} is supported)`,
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 2: the intermediate signing key must be signed by a current
  // Google root key. Root keys without an expiry are skipped, as Tink
  // does for every version after ECv1.
  // ──────────────────────────────────────────────────────────────────
  const trustedRootKeys: crypto.KeyObject[] = []
  for (const rootKey of rootKeys) {
    if (
      rootKey.protocolVersion !== PROTOCOL_VERSION ||
      !rootKey.keyExpiration ||
      !/^\d+$/.test(rootKey.keyExpiration) ||
      Number(rootKey.keyExpiration) <= now
    ) {
      continue
    }
    try {
      trustedRootKeys.push(loadP256PublicKey(rootKey.keyValue))
    } catch {
      // an unusable root key is skipped, like an expired one
    }
  }
  if (trustedRootKeys.length === 0) {
    throw tokenError('root-keys', 'no current ECv2 root signing key')
  }

  const { signedKey, signatures } = envelope.intermediateSigningKey
  const signedKeyBytes = toLengthValue(
    GOOGLE_PAY_SENDER_ID,
    PROTOCOL_VERSION,
    signedKey,
  )
  const intermediateKeySigned = trustedRootKeys.some((rootKey) =>
    signatures.some((signature) =>
      verifiesUnder(rootKey, signedKeyBytes, signature),
    ),
  )
  if (!intermediateKeySigned) {
    throw tokenError(
      'intermediate-signature',
      'no signature on the intermediate key verifies under a root key',
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 3: intermediate key expiry, read only after its signature holds.
  // ──────────────────────────────────────────────────────────────────
  const intermediate = parseJson(
    'parse-intermediate-key',
    signedKey,
    SignedKeySchema,
  )
  if (Number(intermediate.keyExpiration) <= now) {
    throw tokenError('intermediate-expiry', 'intermediate key has expired')
  }
  let intermediateKey: crypto.KeyObject
  try {
    intermediateKey = loadP256PublicKey(intermediate.keyValue)
  } catch (e) {
    throw tokenError('intermediate-key', (e as Error).message)
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 4: the message signature binds signedMessage to us. signedMessage
  // is verified exactly as received, before it is parsed.
  // ──────────────────────────────────────────────────────────────────
  const messageBytes = toLengthValue(
    GOOGLE_PAY_SENDER_ID,
    recipientId,
    PROTOCOL_VERSION,
    envelope.signedMessage,
  )
  if (!verifiesUnder(intermediateKey, messageBytes, envelope.signature)) {
    throw tokenError(
      'message-signature',
      'signature does not verify under the intermediate key for this recipient',
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Steps 5 and 6: derive the keys for each configured private key and
  // keep the one whose MAC matches the tag.
  // ──────────────────────────────────────────────────────────────────
  const message = parseJson(
    'parse-signed-message',
    envelope.signedMessage,
    SignedMessageSchema,
  )
  const ephemeralPoint = Buffer.from(message.ephemeralPublicKey, 'base64')
  if (
    ephemeralPoint.length !== UNCOMPRESSED_P256_POINT_BYTES ||
    ephemeralPoint[0] !== 0x04
  ) {
    throw tokenError(
      'ephemeral-key',
      'ephemeralPublicKey is not an uncompressed P-256 point',
    )
  }
  let ephemeralKey: crypto.KeyObject
  try {
    ephemeralKey = crypto.createPublicKey({
      key: {
        kty: 'EC',
        crv: 'P-256',
        x: ephemeralPoint.subarray(1, 33).toString('base64url'),
        y: ephemeralPoint.subarray(33).toString('base64url'),
      },
      format: 'jwk',
    })
  } catch (e) {
    throw tokenError('ephemeral-key', (e as Error).message)
  }

  const encryptedMessage = Buffer.from(message.encryptedMessage, 'base64')
  const tag = Buffer.from(message.tag, 'base64')

  let aesKey: Buffer | undefined
  for (const pem of privateKeys) {
    let privateKey: crypto.KeyObject
    try {
      privateKey = crypto.createPrivateKey({ key: pem, format: 'pem' })
    } catch (e) {
      throw tokenError('load-private-key', (e as Error).message)
    }
    let sharedSecret: Buffer
    try {
      sharedSecret = crypto.diffieHellman({
        privateKey,
        publicKey: ephemeralKey,
      })
    } catch (e) {
      throw tokenError('ecdh', (e as Error).message)
    }
    const derived = Buffer.from(
      crypto.hkdfSync(
        'sha256',
        Buffer.concat([ephemeralPoint, sharedSecret]),
        Buffer.alloc(0),
        HKDF_INFO,
        AES_KEY_BYTES + HMAC_KEY_BYTES,
      ),
    )
    const computedTag = crypto
      .createHmac('sha256', derived.subarray(AES_KEY_BYTES))
      .update(encryptedMessage)
      .digest()
    if (timingSafeEqual(computedTag, tag)) {
      aesKey = derived.subarray(0, AES_KEY_BYTES)
      break
    }
  }
  if (!aesKey) {
    throw tokenError(
      'mac',
      'tag does not match under any configured private key',
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 7: AES-256-CTR, zero IV, no padding.
  // ──────────────────────────────────────────────────────────────────
  const decipher = crypto.createDecipheriv(
    'aes-256-ctr',
    aesKey,
    Buffer.alloc(16, 0),
  )
  const plaintext = Buffer.concat([
    decipher.update(encryptedMessage),
    decipher.final(),
  ]).toString('utf8')

  // ──────────────────────────────────────────────────────────────────
  // Step 8: payload shape and freshness.
  // ──────────────────────────────────────────────────────────────────
  const payload = parseJson('parse-plaintext', plaintext, PlaintextSchema)
  const messageExpiration = Number(payload.messageExpiration)
  if (messageExpiration <= now) {
    throw tokenError('message-expiry', 'message has expired')
  }
  const details = payload.paymentMethodDetails
  if (details.authMethod === 'CRYPTOGRAM_3DS' && !details.cryptogram) {
    throw tokenError(
      'parse-plaintext',
      'CRYPTOGRAM_3DS payment method has no cryptogram',
    )
  }

  return {
    messageId: payload.messageId,
    messageExpiration,
    paymentMethodDetails: {
      pan: details.pan,
      expirationMonth: details.expirationMonth,
      expirationYear: details.expirationYear,
      authMethod: details.authMethod,
      ...(details.cryptogram && { cryptogram: details.cryptogram }),
      ...(details.eciIndicator && { eciIndicator: details.eciIndicator }),
    },
  }
}
