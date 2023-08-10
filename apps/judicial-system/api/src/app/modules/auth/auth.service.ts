import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'

const { domain, clientId, clientSecret, redirectUri } = environment.idsAuth

@Injectable()
export class AuthService {
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

  async fetchToken(code: string, codeVerifier: string) {
    const requestBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
    })

    const response = await fetch(`${domain}/connect/token`, {
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

  validateUser(user: User): boolean {
    return user.active
  }
}
