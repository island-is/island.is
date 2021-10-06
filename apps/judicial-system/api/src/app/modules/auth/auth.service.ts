import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'

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

  validateUser(user: User): boolean {
    return user.active
  }
}
