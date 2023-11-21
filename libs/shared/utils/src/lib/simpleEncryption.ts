import { Base64 } from 'js-base64'
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
} from 'crypto'

const ALGORITHM = 'aes-256-cbc'

/**
 *
 * @param text The string you wish to hide
 * @param key You secret key
 * @returns URL safe Base64
 */
export const encrypt = (text: string, key: string): string => {
  const iv = randomBytes(16)
  const derivedKey = hashKey(key)

  const cipher = createCipheriv(ALGORITHM, derivedKey, iv)
  const encrypted =
    cipher.update(text, 'utf-8', 'base64') + cipher.final('base64')

  return Base64.encodeURI(`${iv.toString('base64')}:${encrypted}`)
}

/**
 * @param encryptedText Base64 returned from encrypt()
 * @param key You secret key you used in encrypt()
 * @returns Reveals the string hidden by encrypt()
 */
export const decrypt = (encryptedText: string, key: string): string => {
  try {
    const [receivedIv, encryptedData] = Base64.decode(encryptedText).split(':')
    const derivedKey = hashKey(key)
    const decipher = createDecipheriv(
      ALGORITHM,
      derivedKey,
      Buffer.from(receivedIv, 'base64'),
    )

    return (
      decipher.update(encryptedData, 'base64', 'utf-8') +
      decipher.final('utf-8')
    )
  } catch (e) {
    return ''
  }
}

function hashKey(key: string): Buffer {
  return createHash('sha256').update(key).digest()
}
