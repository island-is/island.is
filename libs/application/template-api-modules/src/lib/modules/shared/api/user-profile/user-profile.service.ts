import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import {
  UserProfileControllerFindUserProfileClientTypeEnum,
  V2UsersApi,
} from '@island.is/clients/user-profile'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  BaseTemplateAPIModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicationWithAttachments,
  UserProfile,
  UserProfileParameters,
} from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import { getSlugFromType } from '@island.is/application/core'
import { IdsClientConfig } from '@island.is/nest/config'
import { Inject } from '@nestjs/common'
import { ConfigService, ConfigType } from '@nestjs/config'
import { getConfigValue } from '../../shared.utils'

export const MAX_OUT_OF_DATE_MONTHS = 6

@Injectable()
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: V2UsersApi,
    private readonly islyklarApi: IslyklarApi,
    @Inject(IdsClientConfig.KEY)
    private idsClientConfig: ConfigType<typeof IdsClientConfig>,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
  ) {
    super('UserProfile')
  }

  userProfileApiWithAuth(auth: Auth): V2UsersApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async userProfile({
    auth,
  }: TemplateApiModuleActionProps<UserProfileParameters>): Promise<UserProfile> {
    // Temporary solution while we still run the old user profile service.
    const { mobilePhoneNumber, email } = await this.userProfileApiWithAuth(auth)
      .userProfileControllerFindUserProfile({
        xParamNationalId: auth.nationalId,
        clientType:
          UserProfileControllerFindUserProfileClientTypeEnum.FirstParty,
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

  private getIDSLink(application: ApplicationWithAttachments) {
    const slug = getSlugFromType(application.typeId)
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${this.idsClientConfig.issuer}/app/user-profile/email?state=update&returnUrl=${clientLocationOrigin}/${slug}/${application.id}`
  }
}
