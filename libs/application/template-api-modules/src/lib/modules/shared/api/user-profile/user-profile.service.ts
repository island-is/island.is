import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { UserProfileParameters } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

export const MAX_OUT_OF_DATE_MONTHS = 6

@Injectable()
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: UserProfileApi,
    private readonly islyklarApi: IslyklarApi,
  ) {
    super('UserProfile')
  }

  userProfileApiWithAuth(auth: Auth): UserProfileApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async userProfile({
    auth,
    params,
  }: TemplateApiModuleActionProps<UserProfileParameters>) {
    // Temporary solution while we still run the old user profile service.
    return this.islyklarApi
      .islyklarGet({ ssn: auth.nationalId })

      .then((results) => {
        if (params?.validateBankInformation && !results?.bankInfo) {
          // If individual does not have a valid bank account, then we fail this check
          throw new TemplateApiError(
            {
              title: coreErrorMessages.noBankAccountError,
              summary: coreErrorMessages.noBankAccountError,
            },
            400,
          )
        }

        if (params?.validateEmail && !results?.email) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.noEmailFound,
              summary: coreErrorMessages.noEmailFoundDescription,
            },
            500,
          )
        }

        return {
          mobilePhoneNumber: results?.mobile,
          email: results?.email,
          bankInfo: results?.bankInfo,
        }
      })
      .catch((error) => {
        if (isRunningOnEnvironment('local')) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.noEmailFound,
              summary: coreErrorMessages.noEmailFoundDescription,
            },
            500,
          )

          return {
            email: 'mockEmail@island.is',
            mobilePhoneNumber: '9999999',
            bankInfo: '0000-11-222222',
          }
        }
        if (params?.catchMock) {
          return {}
        }
        throw error
      })
  }
}
