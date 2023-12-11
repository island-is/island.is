import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'

import {
  ActorLocaleLocaleEnum,
  ConfirmationDtoResponse,
  UserProfileApi,
} from '@island.is/clients/user-profile'
import { handle204 } from '@island.is/clients/middlewares'

import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from './islykill.service'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DataStatus } from './types/dataStatus.enum'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { UserProfileServiceV1 } from './V1/userProfile.service'
import { UserProfileServiceV2 } from './V2/userProfile.service'

/** Category to attach each log message to */
const LOG_CATEGORY = 'userprofile-service'

// eslint-disable-next-line
const handleError = (error: any, details?: string) => {
  logger.error(details || 'Userprofile error', {
    error: JSON.stringify(error),
    category: LOG_CATEGORY,
  })
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private readonly islyklarService: IslykillService,
    private userProfileServiceV2: UserProfileServiceV2,
    private userProfileServiceV1: UserProfileServiceV1,
    private featureFlagService: FeatureFlagService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async services(user: User) {
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
    const service = await this.services(user)

    return service.getUserProfile(user)
  }

  async createUserProfile(
    input: CreateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const service = await this.services(user)

    return service.createUserProfile(input, user)
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const service = await this.services(user)

    return service.updateUserProfile(input, user)
  }

  async deleteIslykillValue(
    input: DeleteIslykillValueInput,
    user: User,
  ): Promise<DeleteIslykillSettings> {
    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )
    if (islyklarData.noUserFound) {
      await this.islyklarService
        .createIslykillSettings(user.nationalId, {
          email: undefined,
          mobile: undefined,
        })
        .catch((e) =>
          handleError(e, `deleteIslykillValue:createIslykillSettings error`),
        )
    } else {
      await this.islyklarService
        .updateIslykillSettings(user.nationalId, {
          email: input.email ? undefined : islyklarData.email,
          mobile: input.mobilePhoneNumber ? undefined : islyklarData.mobile,
          canNudge: islyklarData.canNudge,
          bankInfo: islyklarData.bankInfo,
        })
        .catch((e) =>
          handleError(e, `deleteIslykillValue:updateIslykillSettings error`),
        )
    }

    const profileUpdate = {
      ...(input.email && { emailStatus: DataStatus.EMPTY }),
      ...(input.mobilePhoneNumber && { mobileStatus: DataStatus.EMPTY }),
    }

    await this.userProfileApiWithAuth(user)
      .userProfileControllerUpdate({
        nationalId: user.nationalId,
        updateUserProfileDto: profileUpdate,
      })
      .catch((e) =>
        handleError(e, `deleteIslykillValue:userProfileControllerUpdate error`),
      )

    return {
      nationalId: user.nationalId,
      valid: true,
    }
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    const service = await this.services(user)

    return service.createSmsVerification(input, user)
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    const service = await this.services(user)

    return service.createEmailVerification(input, user)
  }

  async resendEmailVerification(user: User): Promise<void> {
    const service = await this.services(user)

    return service.resendEmailVerification(user)
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const service = await this.services(user)

    return service.confirmSms(input, user)
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const service = await this.services(user)

    return service.confirmEmail(input, user)
  }

  async addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerAddDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch((e) => handleError(e, `addDeviceToken error`))
  }

  async deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerDeleteDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch((e) => handleError(e, `deleteDeviceToken error`))
  }
}
