/**
 * @jest-environment node
 */

import { maskString, unmaskString } from './simpleEncryption'

const originalText = 'Original Jest Text!'
const secretKey = 'not-really-secret-key'

describe('Encryption and Decryption Functions', () => {
  test('Encrypt and decrypt a string successfully', async () => {
    const encrypted = await maskString(originalText, secretKey)

    // Check for successful encryption
    expect(encrypted).not.toBe(originalText)
    expect(encrypted).not.toBeNull()

    // If null check succeeds, we can safely cast to string for the unmasking test
    const textToDecrypt = encrypted as string

    const decrypted = await unmaskString(textToDecrypt, secretKey)
    expect(decrypted).toBe(originalText)
    expect(encrypted).not.toBe(originalText)
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
