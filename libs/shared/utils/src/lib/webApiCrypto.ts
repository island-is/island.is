const ALGORITHM = 'AES-CBC'
const DELIMITER = ':' // Delimiter to separate IV and encrypted text

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

// Function to encrypt text
export const encryptText = async (
  plainText: string,
  password: string,
): Promise<string> => {
  const key = await deriveKey(password)
  const iv = crypto.getRandomValues(new Uint8Array(16)) // AES-CBC recommended IV length is 16 bytes

  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    str2ab(plainText),
  )
  const ivStr = bufferToBase64(iv)
  const encryptedStr = bufferToBase64(encrypted)

  return ivStr + DELIMITER + encryptedStr
}

// Function to decrypt text
export const decryptText = async (
  encryptedText: string,
  password: string,
): Promise<string> => {
  const [ivPart, encryptedPart] = encryptedText.split(DELIMITER)
  const iv = base64ToBuffer(ivPart)

  const encrypted = base64ToBuffer(encryptedPart)

  const key = await deriveKey(password)
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    encrypted,
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}
