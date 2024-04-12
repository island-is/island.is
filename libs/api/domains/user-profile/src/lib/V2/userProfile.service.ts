import { BadRequestException, Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'

import {
  ConfirmationDtoResponse,
  V2MeApi,
} from '@island.is/clients/user-profile'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from '../islykill.service'
import { UserProfile } from '../userProfile.model'
import { UpdateUserProfileInput } from '../dto/updateUserProfileInput'
import { CreateSmsVerificationInput } from '../dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from '../dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from '../dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from '../dto/confirmEmailVerificationInput'

/** Category to attach each log message to */
const LOG_CATEGORY = 'userprofile-service-v2'

// eslint-disable-next-line
const handleError = (error: any, details?: string) => {
  logger.error(details || 'Userprofile error', {
    error: JSON.stringify(error),
    category: LOG_CATEGORY,
  })
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileServiceV2 {
  constructor(
    private v2MeApi: V2MeApi,
    private readonly islyklarService: IslykillService,
  ) {}

  v2UserProfileApiWithAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
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

    const userProfile = await this.v2UserProfileApiWithAuth(user)
      .meUserProfileControllerPatchUserProfile({
        patchUserProfileDto: {
          ...alteredInput,
          emailNotifications: alteredInput.canNudge,
        },
      })
      .catch((e) => handleError(e, `updateEmailNotifications error`))

    if (bankInfo) {
      await this.islyklarService
        .updateIslykillSettings(user.nationalId, {
          bankInfo,
        })
        .catch((e) => handleError(e, `updateIslykillSettings error`))
    }

    return {
      ...userProfile,
      canNudge: userProfile.emailNotifications,
    }
  }

  async getUserProfile(user: User): Promise<UserProfile> {
    const userProfile = await this.v2UserProfileApiWithAuth(user)
      .meUserProfileControllerFindUserProfile()
      .catch((e) => handleError(e, `getUserProfileV2 error`))

    const bankInfo = await this.getBankInfo(user)

    return {
      ...userProfile,
      bankInfo,
      canNudge: userProfile.emailNotifications,
    }
  }

  async createSmsVerification(input: CreateSmsVerificationInput, user: User) {
    await this.v2UserProfileApiWithAuth(user)
      .meUserProfileControllerCreateVerification({
        createVerificationDto: input,
      })
      .catch((e) => handleError(e, `createSmsVerification error`))
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    await this.v2UserProfileApiWithAuth(user)
      .meUserProfileControllerCreateVerification({
        createVerificationDto: input,
      })
      .catch((e) => handleError(e, `createEmailVerification error`))
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    throw new BadRequestException(
      'For User Profile V2 call updateUserProfile instead with mobilePhoneNumberVerificationCode',
    )
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    throw new BadRequestException(
      'For User Profile V2 call updateUserProfile instead with emailVerificationCode',
    )
  }

  async resendEmailVerification(user: User): Promise<void> {
    throw new BadRequestException(
      'For User Profile V2 call createEmailVerification instead with email again',
    )
  }
}
