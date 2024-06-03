const ALGORITHM = 'AES-CBC'
const DELIMITER = ':' // Delimiter to separate IV and encrypted text

const crypto = global.window ? window.crypto : require('crypto')

// Function to convert ArrayBuffer to base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

// Function to convert base64 to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer
}

const str2ab = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

// Function to derive a cryptographic key from a text password
const deriveKey = async (password: string): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    str2ab(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      // we do not need to hide this in environment variables since we are not using it for secure encryption but rather to mask strings, so they don't show up in logs
      salt: new TextEncoder().encode('unique-salt-value=='),
      iterations: 1000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

/**
 *
 * @param text The string you wish to hide
 * @param key You secret key
 */
export const maskString = async (
  text: string,
  key: string,
): Promise<string | null> => {
  try {
    const derivedKey = await deriveKey(key)
    const iv = crypto.getRandomValues(new Uint8Array(16)) // AES-CBC recommended IV length is 16 bytes

    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      derivedKey,
      str2ab(text),
    )
    const ivStr = bufferToBase64(iv)
    const encryptedStr = bufferToBase64(encrypted)

    return encodeURIComponent(ivStr + DELIMITER + encryptedStr)
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * @param encryptedText Base64 returned from maskString()
 * @param key The secret key you used in maskString()
 * @returns Reveals the string hidden by maskString()
 */
export const unmaskString = async (
  encryptedText: string,
  key: string,
): Promise<string | null> => {
  try {
    encryptedText = decodeURIComponent(encryptedText)
    const [ivPart, encryptedPart] = encryptedText.split(DELIMITER)
    const iv = base64ToBuffer(ivPart)

    const encrypted = base64ToBuffer(encryptedPart)

    const derivedKey = await deriveKey(key)
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      derivedKey,
      encrypted,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (e) {
    console.error(e)
    return null
  }
}
