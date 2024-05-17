import { BadRequestException, Injectable } from '@nestjs/common'

import {
  ConfirmationDtoResponse,
  UserProfileControllerFindUserProfileClientTypeEnum,
  PostNudgeDtoNudgeTypeEnum,
  V2MeApi,
  V2UsersApi,
} from '@island.is/clients/user-profile'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { IslykillService } from '../islykill.service'
import { UserProfile } from '../userProfile.model'
import { ActorProfile, ActorProfileResponse } from '../dto/actorProfile'
import { UpdateUserProfileInput } from '../dto/updateUserProfileInput'
import { CreateSmsVerificationInput } from '../dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from '../dto/createEmalVerificationInput'
import { UpdateActorProfileInput } from '../dto/updateActorProfileInput'
import { AdminUserProfile } from '../adminUserProfile.model'

@Injectable()
export class UserProfileServiceV2 {
  constructor(
    private v2MeApi: V2MeApi,
    private v2UserProfileApi: V2UsersApi,
    private readonly islyklarService: IslykillService,
  ) {}

  v2MeUserProfileApiWithAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2UserProfileApiWithAuth(auth: Auth) {
    return this.v2UserProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async getBankInfo(user: User) {
    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )

    return islyklarData.bankInfo
  }

  async createUserProfile(input: UpdateUserProfileInput, user: User) {
    return this.updateUserProfile(input, user)
  }

  async updateUserProfile(
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
      await this.islyklarService.updateIslykillSettings(user.nationalId, {
        bankInfo,
      })
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

    const bankInfo = await this.getBankInfo(user)

    return {
      ...userProfile,
      bankInfo,
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

  async confirmSms(): Promise<ConfirmationDtoResponse> {
    throw new BadRequestException(
      'For User Profile V2 call updateUserProfile instead with mobilePhoneNumberVerificationCode',
    )
  }

  async confirmEmail(): Promise<ConfirmationDtoResponse> {
    throw new BadRequestException(
      'For User Profile V2 call updateUserProfile instead with emailVerificationCode',
    )
  }

  async resendEmailVerification(): Promise<void> {
    throw new BadRequestException(
      'For User Profile V2 call createEmailVerification instead with email again',
    )
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
}
