import { BadRequestException, Injectable, Inject } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ActorLocaleLocaleEnum,
  PostNudgeDtoNudgeTypeEnum,
  UserProfileControllerFindUserProfileClientTypeEnum,
  V2ActorApi,
  V2MeApi,
  V2UsersApi,
} from '@island.is/clients/user-profile'

import {
  BankinfoClientService,
  formatBankInfo,
} from '@island.is/clients/fjs/bank-info'
import { AdminUserProfile } from './adminUserProfile.model'
import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { CreateEmailVerificationInput } from './dto/createEmailVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'

import { UserProfile } from './userProfile.model'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { handle204 } from '@island.is/clients/middlewares'
import { SetActorProfileEmailInput } from './dto/setActorProfileEmail.input'
import { UserProfileUpdateActorProfileInput } from './dto/userProfileUpdateActorProfile.input'
import { UserProfileSetActorProfileEmailInput } from './dto/userProfileSetActorProfileEmail.input'
import { UpdateActorProfileEmailInput } from './dto/updateActorProfileEmail.input'
import { ActorProfileDetails } from './dto/actorProfileDetails'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DataStatus } from './types/dataStatus.enum'
import { Email } from './models/email.model'

@Injectable()
export class UserProfileService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private v2MeApi: V2MeApi,
    private v2UserProfileApi: V2UsersApi,
    private v2ActorApi: V2ActorApi,
    private bankinfoClientService: BankinfoClientService,
  ) {}

  v2MeUserProfileApiWithAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2UserProfileApiWithAuth(auth: Auth) {
    return this.v2UserProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2ActorApiWithAuth(auth: Auth) {
    return this.v2ActorApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createUserProfile(input: UpdateUserProfileInput, user: User) {
    return this.updateMeUserProfile(input, user)
  }

  async getUserBankInfo(user: User): Promise<string | null> {
    try {
      const res = await this.bankinfoClientService.getBankAccountsForNationalId(
        user.nationalId,
      )

      if (!res?.bankAccountInfo) {
        return null
      }

      return formatBankInfo(res?.bankAccountInfo)
    } catch (e) {
      return null
    }
  }

  async updateMeUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const { bankInfo, ...alteredInput } = input

    const userProfile = await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerPatchUserProfile({
      patchUserProfileDto: {
        ...alteredInput,
        emailNotifications: alteredInput.canNudge,
        smsNotifications: alteredInput.smsNotifications,
        emailVerificationCode: alteredInput.emailCode,
        mobilePhoneNumberVerificationCode: alteredInput.smsCode,
      },
    })

    if (bankInfo) {
      // validate bank account
      const [bank, ledger, accountNumber] = bankInfo.split('-')
      if (!bank || !ledger || !accountNumber) {
        throw new BadRequestException({
          message:
            'Invalid bank account format, expected: bank-ledger-accountNumber',
        })
      }
      try {
        await this.bankinfoClientService.createBankAccountForNationalId(
          user.nationalId,
          {
            bank,
            ledger,
            accountNumber,
          },
        )
      } catch (e) {
        this.logger.error('Failed to update bank account', e)

        throw new BadRequestException(
          e.message || 'Failed to update bank account',
        )
      }
    }

    return {
      ...userProfile,
      canNudge: userProfile.emailNotifications,
      smsNotifications: userProfile.smsNotifications,
    }
  }

  async getUserProfile(user: User): Promise<UserProfile> {
    const userProfile = await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerFindUserProfile()

    return {
      ...userProfile,
      canNudge: userProfile.emailNotifications,
      smsNotifications: userProfile.smsNotifications,
    }
  }

  async createSmsVerification(input: CreateSmsVerificationInput, user: User) {
    await this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateVerification({
      createVerificationDto: input,
    })
  }

  async createMeSmsVerification(input: CreateSmsVerificationInput, user: User) {
    await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateVerification({
      createVerificationDto: input,
    })
  }
  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    await this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateVerification({
      createVerificationDto: input,
    })
  }

  async createMeEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateVerification({
      createVerificationDto: input,
    })
  }

  async getActorProfile(user: User): Promise<ActorProfileDetails> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerGetSingleActorProfile()
  }

  async getActorProfiles(user: User): Promise<ActorProfileResponse> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerGetActorProfiles()
  }

  async updateActorProfile(
    input: UserProfileUpdateActorProfileInput,
    user: User,
  ): Promise<ActorProfile> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateOrUpdateActorProfile({
      xParamFromNationalId: input.fromNationalId,
      patchActorProfileDto: { emailNotifications: input.emailNotifications },
    })
  }

  async updateActorProfileEmail(
    input: UpdateActorProfileEmailInput,
    user: User,
  ) {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerUpdateActorProfileEmail({
      updateActorProfileEmailDto: input,
    })
  }

  async updateActorProfileEmailWithoutActor(
    input: UpdateActorProfileEmailInput,
    fromNationalId: string,
    user: User,
  ) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerUpdateActorProfileEmail({
      xParamFromNationalId: fromNationalId,
      updateActorProfileEmailDto: input,
    })
  }

  confirmNudge(user: User) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerConfirmNudge({
      postNudgeDto: { nudgeType: PostNudgeDtoNudgeTypeEnum.NUDGE },
    })
  }

  async getUserProfiles(user: User, search: string) {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerFindUserProfiles({
      search: search,
    })
  }

  async getUserProfileByNationalId(
    user: User,
    nationalId: string,
  ): Promise<AdminUserProfile> {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerFindUserProfile({
      clientType: UserProfileControllerFindUserProfileClientTypeEnum.FirstParty,
      xParamNationalId: nationalId,
    })
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
    nationalId: string,
  ): Promise<AdminUserProfile> {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerPatchUserProfile({
      xParamNationalId: nationalId,
      patchUserProfileDto: input,
    })
  }

  async deleteEmail(
    user: User,
    nationalId: string,
    emailId: string,
  ): Promise<boolean> {
    await this.v2UserProfileApiWithAuth(user).userProfileControllerDeleteEmail({
      xParamNationalId: nationalId,
      emailId,
    })

    return true
  }

  async getEmailsByNationalId(
    user: User,
    nationalId: string,
  ): Promise<Email[]> {
    const emails = (await this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerGetUserEmails({
      xParamNationalId: nationalId,
    })) as Array<{
      id: string
      email: string | null
      primary: boolean
      emailStatus: string
      isConnectedToActorProfile: boolean
    }>

    return emails.map((email) => ({
      id: email.id,
      email: email.email,
      primary: email.primary,
      emailStatus: email.emailStatus as DataStatus,
      isConnectedToActorProfile: email.isConnectedToActorProfile,
    }))
  }

  async userProfileSetActorProfileEmailById(
    input: UserProfileSetActorProfileEmailInput,
    user: User,
  ) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerSetActorProfileEmailById({
      xParamFromNationalId: input.fromNationalId,
      setActorProfileEmailDto: {
        emailsId: input.emailId,
      },
    })
  }

  async setActorProfileEmail(input: SetActorProfileEmailInput, user: User) {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerSetActorProfileEmail({
      setActorProfileEmailDto: {
        emailsId: input.emailId,
      },
    })
  }

  addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerAddDeviceToken({
      deviceTokenDto: input,
    })
  }

  deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerDeleteDeviceToken({
      deviceToken: input.deviceToken,
    })
  }

  async getUserProfileLocale(user: User) {
    const locale = await handle204(
      this.v2ActorApiWithAuth(
        user,
      ).actorUserProfileControllerGetActorLocaleRaw(),
    )

    return {
      nationalId: user.nationalId,
      locale: locale?.locale === ActorLocaleLocaleEnum.En ? 'en' : 'is',
    }
  }
}
