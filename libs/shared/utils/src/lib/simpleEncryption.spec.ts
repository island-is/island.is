// simpleEncryption.spec.ts

import { encrypt, decrypt } from './simpleEncryption'

describe('Encryption and Decryption Functions', () => {
  test('Encrypt and decrypt a string successfully', () => {
    const originalText = 'Hello, Jest!'
    const secretKey = 'test-secret-key'

    const encrypted = encrypt(originalText, secretKey)
    const decrypted = decrypt(encrypted, secretKey)

    expect(encrypted).not.toBe(originalText)
    expect(decrypted).toBe(originalText)
  })
})
