import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  PostNudgeDtoNudgeTypeEnum,
  UserProfileControllerFindUserProfileV2ClientTypeEnum,
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
import { UserProfileUpdateActorProfileInput } from '../dto/userProfileUpdateActorProfile.input'
import { UpdateUserProfileInput } from '../dto/updateUserProfileInput'
import { IslykillService } from '../islykill.service'
import { DeleteIslykillSettings } from '../models/deleteIslykillSettings.model'
import { UserProfile } from '../userProfile.model'
import { ActorProfileDetails } from '../dto/actorProfileDetails'
import { SetActorProfileEmailInput } from '../dto/setActorProfileEmail.input'
import { UserProfileSetActorProfileEmailInput } from '../dto/userProfileSetActorProfileEmail.input'
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
    ).meUserProfileControllerPatchUserProfileV2({
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
    ).meUserProfileControllerFindUserProfileV2()

    let bankInfo
    let bankInfoError = false
    try {
      bankInfo = await this.getBankInfo(user)
    } catch (error) {
      bankInfoError = true
    }

    return {
      ...userProfile,
      bankInfo,
      bankInfoError,
      canNudge: userProfile.emailNotifications,
    }
  }

  async createSmsVerification(input: CreateSmsVerificationInput, user: User) {
    await this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateVerificationV2({
      createVerificationDto: input,
    })
  }

  async createMeSmsVerification(input: CreateSmsVerificationInput, user: User) {
    await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateVerificationV2({
      createVerificationDto: input,
    })
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    await this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateVerificationV2({
      createVerificationDto: input,
    })
  }

  async createMeEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    await this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerCreateVerificationV2({
      createVerificationDto: input,
    })
  }

  async getActorProfile(user: User): Promise<ActorProfileDetails> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerGetSingleActorProfileV2()
  }

  async getActorProfiles(user: User): Promise<ActorProfileResponse> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerGetActorProfilesV2()
  }

  async updateActorProfile(
    input: UserProfileUpdateActorProfileInput,
    user: User,
  ): Promise<ActorProfile> {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerCreateOrUpdateActorProfileV2({
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
    ).actorUserProfileControllerUpdateActorProfileEmailV2({
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
    ).meUserProfileControllerUpdateActorProfileEmailV2({
      xParamFromNationalId: fromNationalId,
      updateActorProfileEmailDto: input,
    })
  }

  confirmNudge(user: User) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerConfirmNudgeV2({
      postNudgeDto: { nudgeType: PostNudgeDtoNudgeTypeEnum.NUDGE },
    })
  }

  async getUserProfiles(user: User, search: string) {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerFindUserProfilesV2({
      search: search,
    })
  }

  async getUserProfileByNationalId(
    user: User,
    nationalId: string,
  ): Promise<AdminUserProfile> {
    return this.v2UserProfileApiWithAuth(
      user,
    ).userProfileControllerFindUserProfileV2({
      clientType: UserProfileControllerFindUserProfileV2ClientTypeEnum.FirstParty,
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
    ).userProfileControllerPatchUserProfileV2({
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

  async userProfileSetActorProfileEmailById(
    input: UserProfileSetActorProfileEmailInput,
    user: User,
  ) {
    return this.v2MeUserProfileApiWithAuth(
      user,
    ).meUserProfileControllerSetActorProfileEmailByIdV2({
      xParamFromNationalId: input.fromNationalId,
      setActorProfileEmailDto: {
        emailsId: input.emailId,
      },
    })
  }

  async setActorProfileEmail(input: SetActorProfileEmailInput, user: User) {
    return this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerSetActorProfileEmailV2({
      setActorProfileEmailDto: {
        emailsId: input.emailId,
      },
    })
  }
}
