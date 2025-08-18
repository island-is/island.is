import { createPublicKey, createPrivateKey } from 'crypto'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { JwksConfig } from './jwks.config'

@Injectable()
export class JwksConfigService implements OnModuleInit {
  private privateKeyPem?: string
  private publicKeyPem?: string

  constructor(
    @Inject(JwksConfig.KEY)
    private readonly config: ConfigType<typeof JwksConfig>,
  ) {}

  onModuleInit() {
    this.validateJwtConfig()
  }

  private validateJwtConfig() {
    // Store the PEM strings
    this.privateKeyPem = this.config.privateKey
    this.publicKeyPem = this.config.publicKey

    // Validate that the keys are valid PEM format
    try {
      createPrivateKey(this.privateKeyPem)
      createPublicKey(this.publicKeyPem)
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
}
