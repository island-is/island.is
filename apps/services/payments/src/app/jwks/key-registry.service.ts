import { Injectable, OnModuleInit } from '@nestjs/common'
import { createPublicKey } from 'crypto'
import { exportJWK } from 'jose'

import { environment } from '../../environments'
import { JwkDto } from './dtos/serveJwks.response'

interface JwkEntry {
  kid: string
  jwk: JwkDto
  expiresAt?: Date
}

@Injectable()
export class KeyRegistryService implements OnModuleInit {
  private jwkEntries: JwkEntry[] = []

  async onModuleInit() {
    await this.initialize()
  }

  async initialize() {
    this.jwkEntries = [] // Reset entries

    // Add current key without expiration
    await this.addKeyToRegistry({
      kid: environment.jwtSigning.keyId,
      pem: environment.jwtSigning.publicKey,
    })

    // Add previous key with expiration if it exists
    if (
      environment.jwtSigning.previousPublicKeyId &&
      environment.jwtSigning.previousPublicKey
    ) {
      try {
        const expiresAt = new Date(
          Date.now() + environment.jwtSigning.expiresInMinutes * 60 * 1000,
        )

        await this.addKeyToRegistry({
          kid: environment.jwtSigning.previousPublicKeyId,
          pem: environment.jwtSigning.previousPublicKey,
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
