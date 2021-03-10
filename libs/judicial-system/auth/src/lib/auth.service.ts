import { sign } from 'jsonwebtoken'

import { Injectable } from '@nestjs/common'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'
import { User } from '@island.is/judicial-system/types'

import { Credentials } from './auth.types'

@Injectable()
export class SharedAuthService {
  constructor(private readonly jwtSecret: string) {}

  signJwt(user: User, csrfToken?: string) {
    return sign(
      {
        user,
        csrfToken,
      } as Credentials,
      this.jwtSecret,
      { expiresIn: EXPIRES_IN_SECONDS },
    )
  }
}
