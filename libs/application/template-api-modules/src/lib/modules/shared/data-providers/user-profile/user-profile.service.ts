import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { logger } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'

export const MAX_OUT_OF_DATE_MONTHS = 6

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileApi: UserProfileApi,
    private readonly islyklarApi: IslyklarApi,
  ) {}

  userProfileApiWithAuth(auth: Auth): UserProfileApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfile({ auth }: TemplateApiModuleActionProps) {
    // Temporary solution while we still run the old user profile service.
    return this.islyklarApi
      .islyklarGet({ ssn: auth.nationalId })

      .then((results) => {
        return {
          mobilePhoneNumber: results?.mobile,
          email: results?.email,
        }
      })
      .catch((error) => {
        if (isRunningOnEnvironment('local')) {
          return {
            email: 'mockEmail@island.is',
            mobilePhoneNumber: '9999999',
          }
        }
        throw error
      })
  }
}
