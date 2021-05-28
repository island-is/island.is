import { sign } from 'jsonwebtoken'

import { Inject, Injectable } from '@nestjs/common'

import { User } from '@island.is/financial-aid/types'

import { Credentials } from './auth.types'
import { COOKIE_EXPIRES_IN_SECONDS } from './const'

@Injectable()
export class SharedAuthService {
  constructor(
    @Inject('JWT_SECRET')
    private readonly jwtSecret: string,
  ) {}

  signJwt(user: User, csrfToken?: string) {
    return sign(
      {
        user,
        csrfToken,
      } as Credentials,
      this.jwtSecret,
      { expiresIn: COOKIE_EXPIRES_IN_SECONDS },
    )
  }
}
