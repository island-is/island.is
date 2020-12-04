import jwt from 'jsonwebtoken'

import { Injectable } from '@nestjs/common'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'
import { User } from '@island.is/judicial-system/types'

import environment from './environment'
import { Credentials } from './auth.types'

const { jwtSecret } = environment

@Injectable()
export class SharedAuthService {
  signJwt(user: User, csrfToken?: string) {
    return jwt.sign(
      {
        user,
        csrfToken,
      } as Credentials,
      jwtSecret,
      { expiresIn: EXPIRES_IN_SECONDS },
    )
  }
}
