import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { V2MeApi } from '@island.is/clients/user-profile'
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
import { coreErrorMessages, getSlugFromType } from '@island.is/application/core'
import { IdsClientConfig } from '@island.is/nest/config'
import { Inject } from '@nestjs/common'
import { ConfigService, ConfigType } from '@nestjs/config'
import { getConfigValue } from '../../shared.utils'
import { TemplateApiError } from '@island.is/nest/problem'
import { FetchError } from '@island.is/clients/middlewares'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { AuthDelegationType } from '@island.is/shared/types'

@Injectable()
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: V2MeApi,
    private readonly islyklarApi: IslyklarApi,
    @Inject(IdsClientConfig.KEY)
    private idsClientConfig: ConfigType<typeof IdsClientConfig>,
    @Inject(ConfigService)
    private readonly configService: ConfigService<BaseTemplateAPIModuleConfig>,
  ) {
    super('UserProfile')
  }

  userProfileApiWithAuth(auth: Auth): V2MeApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async userProfile({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<UserProfileParameters>): Promise<UserProfile> {
    const { mobilePhoneNumber, email } = await this.userProfileApiWithAuth(auth)
      .meUserProfileControllerFindUserProfile()
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

    if (params?.validateBankInformation && !bankInfo) {
      // If individual does not have a valid bank account, then we fail this check
      throw new TemplateApiError(
        {
          title: coreErrorMessages.noBankAccountError,
          summary: coreErrorMessages.noBankAccountError,
        },
        400,
      )
    }

    if (params?.validateEmail && !email) {
      const link = this.getRegistrationLink(application, 'email', auth)

      throw new TemplateApiError(
        {
          title: coreErrorMessages.noEmailFound,
          summary: {
            ...(link
              ? {
                  ...coreErrorMessages.noEmailFoundDescription,
                  values: { link },
                }
              : coreErrorMessages.noEmailNoRegistration),
          },
        },
        500,
      )
    }

    if (
      params?.validatePhoneNumber &&
      (!mobilePhoneNumber || !this.isValidPhoneNumber(mobilePhoneNumber))
    ) {
      const link = this.getRegistrationLink(application, 'phone', auth)

      throw new TemplateApiError(
        {
          title: coreErrorMessages.invalidPhoneNumber,
          summary: {
            ...(link
              ? {
                  ...coreErrorMessages.invalidPhoneNumberDescription,
                  values: { link },
                }
              : coreErrorMessages.invalidPhoneNumberNoRegistration),
          },
        },
        500,
      )
    }

    return {
      mobilePhoneNumber: mobilePhoneNumber ?? undefined,
      email: email ?? undefined,
      bankInfo,
    }
  }

  private isValidPhoneNumber = (phoneNumber: string) => {
    const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
    return phone && phone.isValid()
  }

  private async getBankInfoFromIslykill(
    auth: User,
  ): Promise<string | undefined> {
    return this.islyklarApi
      .islyklarGet({ ssn: auth.nationalId })
      .then((results) => {
        return results?.bankInfo
      })
      .catch((error) => {
        if (isRunningOnEnvironment('local')) {
          return '0000-11-222222'
        } else if (error instanceof FetchError && error.status === 404) {
          return undefined
        }
        throw error
      })
  }

  private getRegistrationLink(
    application: ApplicationWithAttachments,
    emailOrPhone: 'email' | 'phone',
    user: User,
  ) {
    if (!user.delegationType) {
      // If delegationType is not set, we have a regular user so we
      // use the new IDS user profile screens to update email/phone
      const slug = getSlugFromType(application.typeId)
      const clientLocationOrigin = getConfigValue(
        this.configService,
        'clientLocationOrigin',
      ) as string

      return `${this.idsClientConfig.issuer}/app/user-profile/${emailOrPhone}?state=update&returnUrl=${clientLocationOrigin}/${slug}/${application.id}`
    } else if (
      user.delegationType.includes(AuthDelegationType.ProcurationHolder)
    ) {
      // ProcurationHolders can use the settings page in the ServicePortal
      // to update their delegated entity email/phone

      return '/minarsidur/min-gogn/stillingar'
    }

    // For other types of delegations we cannot redirect user to update their email/phone
    // For custom delegations on companies we need to display message about the procuration holder
    // being able to update the email/phone details.
    return null
  }
}
