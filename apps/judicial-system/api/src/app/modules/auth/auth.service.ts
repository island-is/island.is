import fetch from 'node-fetch'
import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  async validateUser(authUser: AuthUser): Promise<boolean> {
    const user = await fetch(
      `${environment.backendUrl}/api/user/${authUser.nationalId}`,
    )

    return Boolean(user)
  }
}
