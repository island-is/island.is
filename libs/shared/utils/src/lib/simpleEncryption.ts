import { Base64 } from 'js-base64'
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
} from 'crypto'

export const encrypt = (text: string, key: string) => {
  const iv = randomBytes(16)
  const derivedKey = hashKey(key)

  if (!Buffer.isBuffer(derivedKey)) {
    throw new Error('Derived key is not a Buffer.')
  }

  if (!Buffer.isBuffer(iv)) {
    throw new Error('Initialization vector is not a Buffer.')
  }

  const cipher = createCipheriv('aes-256-cbc', derivedKey, iv)
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf-8'),
    cipher.final(),
  ])

  const cleanString = Base64.encodeURI(
    `${iv.toString('base64')}:${encrypted.toString('base64')}`,
  )
  return cleanString
}

export const decrypt = (encryptedText: string, key: string) => {
  try {
    const cleanString = Base64.decode(encryptedText)
    const [receivedIv, encryptedData] = cleanString.split(':')
    const derivedKey = hashKey(key)
    const decipher = createDecipheriv(
      'aes-256-cbc',
      derivedKey,
      Buffer.from(receivedIv, 'base64'),
    )

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'base64')),
      decipher.final(),
    ])

    return decrypted.toString('utf-8')
  } catch (e) {
    return ''
  }
}

function hashKey(key: string): Buffer {
  const hash = createHash('sha256')
  hash.update(key)
  return hash.digest()
}
