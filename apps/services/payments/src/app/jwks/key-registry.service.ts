import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { createPublicKey } from 'crypto'
import { exportJWK } from 'jose'

import { environment } from '../../environments'
import { JwkDto } from './dtos/serveJwks.response'
import { ConfigType } from '@nestjs/config'
import { JwtConfig } from './jwks.config'

interface JwkEntry {
  kid: string
  jwk: JwkDto
  expiresAt?: Date
}

@Injectable()
export class KeyRegistryService implements OnModuleInit {
  private jwkEntries: JwkEntry[] = []

  constructor(
    @Inject(JwtConfig.KEY)
    private readonly config: ConfigType<typeof JwtConfig>,
  ) {}

  async onModuleInit() {
    await this.initialize()
  }

  async initialize() {
    this.jwkEntries = [] // Reset entries

    // Add current key without expiration
    await this.addKeyToRegistry({
      kid: this.config.keyId,
      pem: this.config.publicKey,
    })

    // Add previous key with expiration if it exists
    if (this.config.previousPublicKeyId && this.config.previousPublicKey) {
      try {
        const expiresAt = new Date(
          Date.now() + this.config.expiresInMinutes * 60 * 1000,
        )

        await this.addKeyToRegistry({
          kid: this.config.previousPublicKeyId,
          pem: this.config.previousPublicKey,
          expiresAt,
        })
      } catch (err) {
        console.error('Error processing previous key:', err)
      }
    }
  }

  private async addKeyToRegistry({
    kid,
    pem,
    expiresAt,
  }: {
    kid: string
    pem: string
    expiresAt?: Date
  }) {
    const jwk = await exportJWK(createPublicKey(pem))
    this.jwkEntries.push({
      kid,
      jwk: {
        ...jwk,
        kid,
        use: 'sig',
        alg: 'RS256',
      } as JwkDto,
      expiresAt,
    })
  }

  async getJwks() {
    const now = new Date()
    const activeJwks = this.jwkEntries
      .filter((entry) => !entry.expiresAt || entry.expiresAt > now)
      .map((entry) => entry.jwk)

    return { keys: activeJwks }
  }
}
