import fetch from 'node-fetch'
import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  async validateUser(authUser: AuthUser): Promise<boolean> {
    const res = await fetch(
      `${environment.backendUrl}/api/user/${authUser.nationalId}`,
    )

    if (!res.ok) {
      return false
    }

    const user = await res.json()

    return user?.active
  }
}
