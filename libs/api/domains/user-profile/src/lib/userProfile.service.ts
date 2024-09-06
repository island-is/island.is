import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import {
  ActorLocaleLocaleEnum,
  ConfirmationDtoResponse,
  UserProfileApi,
} from '@island.is/clients/user-profile'
import { handle204 } from '@island.is/clients/middlewares'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { UserProfile } from './userProfile.model'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { UserProfileServiceV1 } from './V1/userProfile.service'
import { UserProfileServiceV2 } from './V2/userProfile.service'
import { UpdateActorProfileInput } from './dto/updateActorProfileInput'

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private userProfileServiceV2: UserProfileServiceV2,
    private userProfileServiceV1: UserProfileServiceV1,
    private featureFlagService: FeatureFlagService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async getService(user: User) {
    const isV2 = await this.featureFlagService.getValue(
      Features.isIASSpaPagesEnabled,
      false,
      user,
    )

    return isV2 ? this.userProfileServiceV2 : this.userProfileServiceV1
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

  async getUserProfile(user: User) {
    const service = await this.getService(user)

    return service.getUserProfile(user)
  }

  async createUserProfile(
    input: CreateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const service = await this.getService(user)

    return service.createUserProfile(input, user)
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const service = await this.getService(user)

    return service.updateUserProfile(input, user)
  }

  async deleteIslykillValue(
    input: DeleteIslykillValueInput,
    user: User,
  ): Promise<DeleteIslykillSettings> {
    const { nationalId } = await this.userProfileServiceV2.updateUserProfile(
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

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    const service = await this.getService(user)

    return service.createSmsVerification(input, user)
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    const service = await this.getService(user)

    return service.createEmailVerification(input, user)
  }

  async resendEmailVerification(user: User): Promise<void> {
    const service = await this.getService(user)

    return service.resendEmailVerification(user)
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const service = await this.getService(user)

    return service.confirmSms(input, user)
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const service = await this.getService(user)

    return service.confirmEmail(input, user)
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

  async updateActorProfile(input: UpdateActorProfileInput, user: User) {
    return this.userProfileServiceV2.updateActorProfile(input, user)
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

  confirmNudge(user: User) {
    return this.userProfileServiceV2.confirmNudge(user)
  }
}
