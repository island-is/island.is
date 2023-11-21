import { Base64 } from 'js-base64'
import { createCipheriv, createDecipheriv, createHash } from 'crypto'

const ALGORITHM = 'aes-256-cbc'

/**
 *
 * @param text The string you wish to hide
 * @param key You secret key
 * @returns URL safe Base64
 */
export const encrypt = (text: string, key: string): string => {
  const derivedKey = hashKey(key)

  const cipher = createCipheriv(ALGORITHM, derivedKey, Buffer.alloc(16))
  const encrypted =
    cipher.update(text, 'utf-8', 'base64') + cipher.final('base64')

  return Base64.encodeURI(encrypted)
}

/**
 * @param encryptedText Base64 returned from encrypt()
 * @param key The secret key you used in encrypt()
 * @returns Reveals the string hidden by encrypt()
 */
export const decrypt = (encryptedText: string, key: string): string => {
  try {
    const encryptedData = Base64.decode(encryptedText)
    const derivedKey = hashKey(key)
    const decipher = createDecipheriv(ALGORITHM, derivedKey, Buffer.alloc(16))

    return (
      decipher.update(encryptedData, 'base64', 'utf-8') +
      decipher.final('utf-8')
    )
  } catch (e) {
    return encryptedText
  }
}

function hashKey(key: string): Buffer {
  return createHash('sha256').update(key).digest()
}
