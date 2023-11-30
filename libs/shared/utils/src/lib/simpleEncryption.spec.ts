import { maskString, unmaskString } from './simpleEncryption'

const originalText = 'Original Jest Text!'
const secretKey = 'not-really-secret-key'

describe('Encryption and Decryption Functions', () => {
  test('Encrypt and decrypt a string successfully', () => {
    const encrypted = maskString(originalText, secretKey)

    // Check for successful encryption
    expect(encrypted).not.toBe(originalText)

    // Check for successful decryption
    if (encrypted !== null) {
      const decrypted = unmaskString(encrypted, secretKey)
      expect(decrypted).toBe(originalText)
      expect(encrypted).not.toBe(originalText)
    } else {
      // Fail the test explicitly if encryption failed
      fail('Encryption failed')
    }
  })

  test('Return null in case of decryption failure', () => {
    // Example: testing decryption failure
    const decryptedFailure = unmaskString('invalid-encrypted-text', secretKey)
    expect(decryptedFailure).toBeNull()
  })
})

// const iterations = 1000
// test.concurrent('Performance: encrypt and decrypt', async () => {
//   const startEncrypt = Date.now()
//   for (let i = 0; i < iterations; i++) {
//     encrypt(originalText, secretKey)
//   }
//   const endEncrypt = Date.now()

//   const encryptedText = encrypt(originalText, secretKey)

//   const startDecrypt = Date.now()
//   for (let i = 0; i < iterations; i++) {
//     decrypt(encryptedText, secretKey)
//   }
//   const endDecrypt = Date.now()

//   const encryptTime = endEncrypt - startEncrypt
//   const decryptTime = endDecrypt - startDecrypt

//   console.log(`Encrypt Time: ${encryptTime}ms`)
//   console.log(`Decrypt Time: ${decryptTime}ms`)

//   expect(encryptTime).toBeLessThan(100)
//   expect(decryptTime).toBeLessThan(100)
// })
