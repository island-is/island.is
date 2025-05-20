import { createPublicKey, createPrivateKey, KeyObject } from 'crypto'
import { Injectable, OnModuleInit } from '@nestjs/common'

import { environment } from '../../environments'

@Injectable()
export class JwtConfigService implements OnModuleInit {
  private privateKeyObject?: KeyObject
  private publicKeyObject?: KeyObject
  private privateKeyPem?: string
  private publicKeyPem?: string

  onModuleInit() {
    this.validateJwtConfig()
  }

  private validateJwtConfig() {
    const requiredFields = [
      'privateKey',
      'publicKey',
      'keyId',
      'issuer',
      'expiresInMinutes',
    ] as const

    const missingFields = requiredFields.filter(
      (field) => !environment.jwtSigning[field],
    )

    if (missingFields.length > 0) {
      throw new Error(
        `JWT signing configuration is incomplete. Missing required fields: ${missingFields.join(
          ', ',
        )}`,
      )
    }

    // Store the PEM strings
    this.privateKeyPem = environment.jwtSigning.privateKey
    this.publicKeyPem = environment.jwtSigning.publicKey

    // Validate that the keys are valid PEM format and store the KeyObjects
    try {
      this.privateKeyObject = createPrivateKey(this.privateKeyPem)
      this.publicKeyObject = createPublicKey(this.publicKeyPem)
    } catch (error) {
      throw new Error(`Invalid JWT signing keys format: ${error.message}`)
    }
  }

  getPrivateKey(): string {
    if (!this.privateKeyPem) {
      throw new Error('Private key not initialized')
    }
    return this.privateKeyPem
  }

  getPublicKey(): string {
    if (!this.publicKeyPem) {
      throw new Error('Public key not initialized')
    }
    return this.publicKeyPem
  }

  getPrivateKeyObject(): KeyObject {
    if (!this.privateKeyObject) {
      throw new Error('Private key not initialized')
    }
    return this.privateKeyObject
  }

  getPublicKeyObject(): KeyObject {
    if (!this.publicKeyObject) {
      throw new Error('Public key not initialized')
    }
    return this.publicKeyObject
  }
}
