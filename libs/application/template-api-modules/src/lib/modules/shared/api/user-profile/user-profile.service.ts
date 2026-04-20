import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
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
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  BankinfoClientService,
  formatBankInfo,
} from '@island.is/clients/fjs/bank-info'

@Injectable()
@CodeOwner(CodeOwners.NordaApplications)
export class UserProfileService extends BaseTemplateApiService {
  constructor(
    private readonly userProfileApi: V2MeApi,
    private readonly bankinfoClientService: BankinfoClientService,
    @Inject(IdsClientConfig.KEY)
    private readonly idsClientConfig: ConfigType<typeof IdsClientConfig>,
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

    const bankInfoRes =
      await this.bankinfoClientService.getBankAccountsForNationalId(
        auth.nationalId,
      )

    if (params?.validateBankInformation) {
      if (!bankInfoRes) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.noBankAccountError,
            summary: {
              ...coreErrorMessages.noBankAccountErrorDescription,
              values: {
                link: this.getIDSLink(application),
              },
            },
          },
          400,
        )
      }
      if (bankInfoRes) {
        if (!bankInfoRes?.bankAccountInfo || bankInfoRes.error) {
          // If individual does not have a valid bank account, then we fail this check
          throw new TemplateApiError(
            {
              title: coreErrorMessages.invalidBankAccountError,
              summary: coreErrorMessages.invalidBankAccountError,
            },
            400,
          )
        }
      }
    }

    const bankInfo = bankInfoRes
      ? formatBankInfo(bankInfoRes.bankAccountInfo)
      : undefined

    if (isRunningOnEnvironment('local') && !mobilePhoneNumber && !email) {
      return {
        email: 'mockEmail@island.is',
        mobilePhoneNumber: '9999999',
        bankInfo: bankInfo ?? undefined,
      }
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
      bankInfo: bankInfo ?? undefined,
    }
  }

  private isValidPhoneNumber = (phoneNumber: string) => {
    const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
    return phone && phone.isValid()
  }

  private getIDSLink(
    application: ApplicationWithAttachments,
    include?: { email?: boolean; phone?: boolean },
  ) {
    let idsUserProfileLink = ''
    if (include?.email) {
      idsUserProfileLink = '/app/user-profile/email'
    } else if (include?.phone) {
      idsUserProfileLink = '/app/user-profile/phone'
    } else {
      idsUserProfileLink = '/app/user-profile/'
    }

    const slug = getSlugFromType(application.typeId)
    const clientLocationOrigin = getConfigValue(
      this.configService,
      'clientLocationOrigin',
    ) as string

    return `${this.idsClientConfig.issuer}${idsUserProfileLink}?state=update&returnUrl=${clientLocationOrigin}/${slug}/${application.id}`
  }
}
