import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  UserProfile,
  UserProfileParameters,
} from '@island.is/application/types'

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
  }: TemplateApiModuleActionProps<UserProfileParameters>): Promise<UserProfile> {
    const { mobilePhoneNumber, email } = await this.userProfileApiWithAuth(auth)
      .userProfileControllerFindOneByNationalId({
        nationalId: auth.nationalId,
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

    /// Temporary dependency on íslykill for bank info retrieval via FJS API.
    /// A refactor is planned to integrate bank info directly from FJS API to eliminate íslykill dependency.
    const bankInfo = await this.getBankInfoFromIslykill(auth)

    return {
      mobilePhoneNumber,
      email,
      bankInfo,
    }
  }

  private async getBankInfoFromIslykill(auth: User) {
    return this.islyklarApi
      .islyklarGet({ ssn: auth.nationalId })
      .then((results) => {
        return results?.bankInfo
      })
      .catch((error) => {
        if (isRunningOnEnvironment('local')) {
          return '0000-11-222222'
        }
        throw error
      })
  }
}
