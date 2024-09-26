import { Injectable } from '@nestjs/common'
import { promisify } from 'util'
import * as crypto from 'crypto'

const randomBytesAsync = promisify(crypto.randomBytes)

@Injectable()
export class PKCEService {
  /**
   * Generate a PKCE code verifier
   * Generates a 50-character long verifier by default
   */
  public async generateCodeVerifier(): Promise<string> {
    return this.generateVerifier(50)
  }

  /**
   * Generate a PKCE code challenge based on the verifier
   * Uses SHA-256 hashing and Base64 URL encoding
   */
  public async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Convert the verifier to a Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)

    // Use Web Crypto API for async hashing
    const hashBuffer = await crypto.webcrypto.subtle.digest('SHA-256', data)

    // and then Base64 URL encode
    return this.base64UrlEncode(Buffer.from(hashBuffer))
  }

  /**
   * Creates an array of length "size" of random bytes
   * @returns Array of random ints (0 to 255)
   */
  async getRandomValues(size: number): Promise<Uint8Array> {
    const randomBytes = await randomBytesAsync(size)

    return new Uint8Array(randomBytes)
  }

  /**
   * Generate a PKCE challenge verifier
   * Generates cryptographically strong random string
   */
  async generateVerifier(length = 50): Promise<string> {
    const mask =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'

    let result = ''
    const randomUints = await this.getRandomValues(length)

    for (let i = 0; i < length; i++) {
      // Cap the value of the randomIndex to mask.length - 1
      const randomIndex = randomUints[i] % mask.length
      result += mask[randomIndex]
    }

    return result
  }

  /**
   * Base64 URL encode the buffer input
   * This utility function converts a Buffer to a Base64 URL-safe string,
   * replacing + with -, / with _, and removing any padding = characters.
   * This is necessary because the standard Base64 encoding includes characters (+, /, and padding =) that are not URL-safe.
   */
  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}