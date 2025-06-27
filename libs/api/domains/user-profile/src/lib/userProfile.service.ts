import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle204 } from '@island.is/clients/middlewares'
import {
  ActorLocaleLocaleEnum,
  UserProfileApi,
} from '@island.is/clients/user-profile'

import { UserProfileServiceV2 } from './V2/userProfile.service'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { SetActorProfileEmailInput } from './dto/setActorProfileEmail.input'
import { UserProfileUpdateActorProfileInput } from './dto/userProfileUpdateActorProfile.input'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { UserProfileSetActorProfileEmailInput } from './dto/userProfileSetActorProfileEmail.input'
import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UserProfile } from './userProfile.model'
import { UpdateActorProfileEmailInput } from './dto/updateActorProfileEmail.input'

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private userProfileServiceV2: UserProfileServiceV2,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfileLocale(user: User) {
    // This always calls the user profile API V1, which calls the actor API
    const locale = await handle204(
      this.userProfileApiWithAuth(
        user,
      ).userProfileControllerGetActorLocaleRaw(),
    )

    return {
      nationalId: user.nationalId,
      locale: locale?.locale === ActorLocaleLocaleEnum.En ? 'en' : 'is',
    }
  }

  async deleteIslykillValue(
    input: DeleteIslykillValueInput,
    user: User,
  ): Promise<DeleteIslykillSettings> {
    const { nationalId } = await this.userProfileServiceV2.updateMeUserProfile(
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

  async getUserProfile(user: User) {
    return this.userProfileServiceV2.getUserProfile(user)
  }

  async createUserProfile(
    input: CreateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    return this.userProfileServiceV2.createUserProfile(input, user)
  }

  async updateMeUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    return this.userProfileServiceV2.updateMeUserProfile(input, user)
  }

  async updateUserProfile(
    nationalId: string,
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    return this.userProfileServiceV2.updateUserProfile(input, user, nationalId)
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    return this.userProfileServiceV2.createSmsVerification(input, user)
  }

  async createMeSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    return this.userProfileServiceV2.createMeSmsVerification(input, user)
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    return this.userProfileServiceV2.createEmailVerification(input, user)
  }

  async createMeEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    return this.userProfileServiceV2.createMeEmailVerification(input, user)
  }

  addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.userProfileApiWithAuth(
      user,
    ).userProfileControllerAddDeviceToken({
      nationalId: user.nationalId,
      deviceTokenDto: input,
    })
  }

  deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return this.userProfileApiWithAuth(
      user,
    ).userProfileControllerDeleteDeviceToken({
      nationalId: user.nationalId,
      deviceTokenDto: input,
    })
  }

  async getActorProfiles(user: User) {
    return this.userProfileServiceV2.getActorProfiles(user)
  }

  async getActorProfile(user: User) {
    return this.userProfileServiceV2.getActorProfile(user)
  }

  async updateActorProfile(
    input: UserProfileUpdateActorProfileInput,
    user: User,
  ) {
    return this.userProfileServiceV2.updateActorProfile(input, user)
  }

  async updateActorProfileEmail(
    input: UpdateActorProfileEmailInput,
    user: User,
  ) {
    return this.userProfileServiceV2.updateActorProfileEmail(input, user)
  }

  async updateActorProfileEmailWithoutActor(
    input: UpdateActorProfileEmailInput,
    fromNationalId: string,
    user: User,
  ) {
    return this.userProfileServiceV2.updateActorProfileEmailWithoutActor(
      input,
      fromNationalId,
      user,
    )
  }

  async setActorProfileEmail(input: SetActorProfileEmailInput, user: User) {
    return this.userProfileServiceV2.setActorProfileEmail(input, user)
  }

  async getUserProfiles(user: User, query: string) {
    return this.userProfileServiceV2.getUserProfiles(user, query)
  }

  async getUserProfileByNationalId(user: User, nationalId: string) {
    return this.userProfileServiceV2.getUserProfileByNationalId(
      user,
      nationalId,
    )
  }

  async userProfileSetActorProfileEmailById(
    input: UserProfileSetActorProfileEmailInput,
    user: User,
  ) {
    return this.userProfileServiceV2.userProfileSetActorProfileEmailById(
      input,
      user,
    )
  }

  confirmNudge(user: User) {
    return this.userProfileServiceV2.confirmNudge(user)
  }
}
