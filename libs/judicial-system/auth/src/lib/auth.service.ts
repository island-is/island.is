import { sign } from 'jsonwebtoken'

import { Inject, Injectable } from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'
import { type User } from '@island.is/judicial-system/types'

import { sharedAuthModuleConfig } from './auth.config'
import { Credentials } from './auth.types'

@Injectable()
export class SharedAuthService {
  constructor(
    @Inject(sharedAuthModuleConfig.KEY)
    private readonly config: ConfigType<typeof sharedAuthModuleConfig>,
  ) {}

  signJwt(
    currentUserNationalId: string,
    currentUser?: User,
    csrfToken?: string,
  ) {
    const credentials: Credentials = {
      currentUserNationalId,
      currentUser,
      csrfToken,
    }

    return sign(credentials, this.config.jwtSecret, {
      expiresIn: EXPIRES_IN_SECONDS,
    })
  }
}
