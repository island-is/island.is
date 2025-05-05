import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'
import { V2MeApi } from '@island.is/clients/user-profile'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  SharedModuleConfig,
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
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

@Injectable()
@CodeOwner(CodeOwners.NordaApplications)
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: V2MeApi,
    private readonly islyklarApi: IslyklarApi,
    @Inject(IdsClientConfig.KEY)
    private idsClientConfig: ConfigType<typeof IdsClientConfig>,
    @Inject(ConfigService)
    private readonly configService: ConfigService<SharedModuleConfig>,
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

    const isActor = !!auth.actor?.nationalId
    const emailIsInvalid =
      (params?.validateEmail ||
        (params?.validateEmailIfNotActor && !isActor)) &&
      !email
    const phoneIsInvalid =
      (params?.validatePhoneNumber ||
        (params?.validatePhoneNumberIfNotActor && !isActor)) &&
      (!mobilePhoneNumber || !this.isValidPhoneNumber(mobilePhoneNumber))

    if (emailIsInvalid && phoneIsInvalid) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.invalidEmailOrPhone,
          summary: {
            ...coreErrorMessages.invalidEmailOrPhoneDescription,
            values: {
              link: this.getIDSLink(application, { email: true, phone: true }),
            },
          },
        },
        400,
      )
    } else if (emailIsInvalid) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.noEmailFound,
          summary: {
            ...coreErrorMessages.noEmailFoundDescription,
            values: { link: this.getIDSLink(application, { email: true }) },
          },
        },
        400,
      )
    } else if (phoneIsInvalid) {
      if (!mobilePhoneNumber || !this.isValidPhoneNumber(mobilePhoneNumber))
        throw new TemplateApiError(
          {
            title: coreErrorMessages.invalidPhone,
            summary: {
              ...coreErrorMessages.invalidPhoneDescription,
              values: { link: this.getIDSLink(application, { phone: true }) },
            },
          },
          400,
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

  private getIDSLink(
    application: ApplicationWithAttachments,
    include: { email?: boolean; phone?: boolean },
  ) {
    let idsUserProfileLink = ''
    if (include.email && include.phone) {
      idsUserProfileLink = '/app/user-profile/'
    } else if (include.email) {
      idsUserProfileLink = '/app/user-profile/email'
    } else if (include.phone) {
      idsUserProfileLink = '/app/user-profile/phone'
    }

    if (!idsUserProfileLink) {
      throw new Error('Missing user profile link type')
    }

    const slug = getSlugFromType(application.typeId)
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${this.idsClientConfig.issuer}${idsUserProfileLink}?state=update&returnUrl=${clientLocationOrigin}/${slug}/${application.id}`
  }
}
