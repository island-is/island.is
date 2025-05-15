import { BadRequestException, Injectable } from '@nestjs/common'

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
} from '@island.is/clients/fjs/bankinfo'
import { AdminUserProfile } from './adminUserProfile.model'
import { ActorProfile, ActorProfileResponse } from './dto/actorProfile'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { UpdateActorProfileInput } from './dto/updateActorProfileInput'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'

import { UserProfile } from './userProfile.model'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { handle204 } from '@island.is/clients/middlewares'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

@Injectable()
export class UserProfileService {
  constructor(
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
      // update bank info
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
        console.error('Failed to update bank info', e)
        throw new ProblemError({
          type: ProblemType.BAD_SESSION,
          title: 'Failed to update bank info',
          detail: e.message,
        })
      }
    }

    return {
      ...userProfile,
      canNudge: userProfile.emailNotifications,
    }
  }

  async getUserProfile(user: User): Promise<UserProfile> {
    const userProfile = await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerFindUserProfile()

    return {
      ...userProfile,
      canNudge: userProfile.emailNotifications,
    }
  }

  async createSmsVerification(input: CreateSmsVerificationInput, user: User) {
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
    await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateVerification({
      createVerificationDto: input,
    })
  }

  async getActorProfiles(user: User): Promise<ActorProfileResponse> {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerGetActorProfiles()
  }

  async updateActorProfile(
    input: UpdateActorProfileInput,
    user: User,
  ): Promise<ActorProfile> {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateOrUpdateActorProfile({
      xParamFromNationalId: input.fromNationalId,
      patchActorProfileDto: { emailNotifications: input.emailNotifications },
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

  addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerAddDeviceToken({
      deviceTokenDto: input,
    })
  }

  deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userTokenControllerDeleteUserDeviceToken({
      xParamNationalId: user.nationalId,
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
