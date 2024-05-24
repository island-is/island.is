import { maskString, unmaskString } from './simpleEncryption'

const originalText = 'Original Jest Text!'
const secretKey = 'not-really-secret-key'

describe('Encryption and Decryption Functions', () => {
  test('Encrypt and decrypt a string successfully', async () => {
    const encrypted = await maskString(originalText, secretKey)

    // Check for successful encryption
    expect(encrypted).not.toBe(originalText)

    // Check for successful decryption
    if (encrypted !== null) {
      const decrypted = await unmaskString(encrypted, secretKey)
      expect(decrypted).toBe(originalText)
      expect(encrypted).not.toBe(originalText)
    } else {
      // Fail the test explicitly if encryption failed
      fail('Encryption failed')
    }
  })

  test('Return null in case of decryption failure', async () => {
    // Example: testing decryption failure
    const decryptedFailure = await unmaskString(
      'invalid-encrypted-text',
      secretKey,
    )
    expect(decryptedFailure).toBeNull()
  })
})
