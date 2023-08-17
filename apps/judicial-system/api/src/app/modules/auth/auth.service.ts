import fetch from 'isomorphic-fetch'
import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import type { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { authModuleConfig } from './auth.config'

@Injectable()
export class AuthService {
  constructor(
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
  ) {}

  async findUser(nationalId: string): Promise<User | undefined> {
    const res = await fetch(
      `${environment.backend.url}/api/user/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )

    if (!res.ok) {
      return undefined
    }

    return await res.json()
  }

  async findDefender(nationalId: string): Promise<User | undefined> {
    const res = await fetch(
      `${environment.backend.url}/api/cases/limitedAccess/defender?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )

    if (!res.ok) {
      return undefined
    }

    return await res.json()
  }

  async fetchIdsToken(code: string, codeVerifier: string) {
    const requestBody = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code: code,
      redirect_uri: this.config.redirectUri,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
    })

    const response = await fetch(`${this.config.domain}/connect/token`, {
      method: 'POST',
      body: requestBody,
    })

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(
        `Request failed with status ${response.status} - ${response.statusText}`,
      )
    }
  }

  async verifyIdsToken(token: string) {
    const secretClient = jwksClient({
      cache: true,
      rateLimit: true,
      jwksUri: `${this.config.domain}/.well-known/openid-configuration/jwks`,
    })

    const signingKeys = await secretClient.getSigningKeys()

    const successKey = signingKeys.find((sk) => {
      try {
        const publicKey = sk.getPublicKey()
        jwt.verify(token, publicKey)
        return publicKey
      } catch (e) {
        throw new Error(`Failed to verify token: ${e.message}`)
      }
    })

    if (successKey) {
      return true
    }

    return false
  }

  validateUser(user: User): boolean {
    return user.active
  }
}
