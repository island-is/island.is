import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
@Injectable()
export class UserProfileService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly userProfileApi: UserProfileApi,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfile({ auth }: TemplateApiModuleActionProps) {
    try {
      //TODO finish this
      const profile = await this.userProfileApiWithAuth(
        auth,
      ).userProfileControllerFindOneByNationalId({
        nationalId: auth.nationalId,
      })

      return {
        email: profile.email,
        emailVerified: profile.emailVerified,
        mobilePhoneNumber: profile.mobilePhoneNumber,
        mobilePhoneNumberVerified: profile.mobilePhoneNumberVerified,
      }
    } catch (e) {
      if (isRunningOnEnvironment('local')) {
        return {
          email: 'mockEmail@island.is',
          mobilePhoneNumber: '9999999',
        }
      }
      throw e
    }
  }
}
