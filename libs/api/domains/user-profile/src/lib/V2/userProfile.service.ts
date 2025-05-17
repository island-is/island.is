import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  PostNudgeDtoNudgeTypeEnum,
  UserProfileControllerFindUserProfileClientTypeEnum,
  V2ActorApi,
  V2MeApi,
  V2UsersApi,
} from '@island.is/clients/user-profile'

import { ApolloError } from 'apollo-server-express'
import { AdminUserProfile } from '../adminUserProfile.model'
import { ActorProfile, ActorProfileResponse } from '../dto/actorProfile'
import { CreateEmailVerificationInput } from '../dto/createEmalVerificationInput'
import { CreateSmsVerificationInput } from '../dto/createSmsVerificationInput'
import { DeleteIslykillValueInput } from '../dto/deleteIslykillValueInput'
import { UpdateActorProfileInput } from '../dto/updateActorProfileInput'
import { UpdateUserProfileInput } from '../dto/updateUserProfileInput'
import { IslykillService } from '../islykill.service'
import { DeleteIslykillSettings } from '../models/deleteIslykillSettings.model'
import { UserProfile } from '../userProfile.model'
import { UpdateActorProfileEmailInput } from '../dto/updateActorProfileEmail.input'

@Injectable()
export class UserProfileServiceV2 {
  constructor(
    private v2MeApi: V2MeApi,
    private v2UserProfileApi: V2UsersApi,
    private v2ActorApi: V2ActorApi,
    private readonly islyklarService: IslykillService,
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

  private async getBankInfo(user: User) {
    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )

    return islyklarData.bankInfo
  }

  async createUserProfile(input: UpdateUserProfileInput, user: User) {
    return this.updateMeUserProfile(input, user)
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
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateOrUpdateActorProfile({
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

  async deleteIslykillValue(
    input: DeleteIslykillValueInput,
    user: User,
  ): Promise<DeleteIslykillSettings> {
    const { nationalId } = await this.updateMeUserProfile(
      {
        ...(input.email && { email: '' }),
        ...(input.mobilePhoneNumber && { mobilePhoneNumber: '' }),
      },
      user,
    )

    if (!nationalId) {
      throw new ApolloError('Failed to update user profile')
    }

    return {
      nationalId,
      valid: true,
    }
  }

  async updateActorProfileEmail(
    input: UpdateActorProfileEmailInput,
    user: User,
  ) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerUpdateActorProfileEmailById({
      fromNationalId: input.fromNationalId,
      setActorProfileEmailDto: {
        emailsId: input.emailsId,
      },
    })
  }
}
