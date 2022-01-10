import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { ApolloError } from 'apollo-server-express'
import {
  ConfirmationDtoResponse,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileApi,
  UserProfileControllerCreateRequest,
  UserProfileControllerUpdateRequest,
} from '@island.is/clients/user-profile'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from '@island.is/api/domains/islykill'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private readonly islyklarService: IslykillService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfile(user: User) {
    try {
      const profile = await this.userProfileApiWithAuth(
        user,
      ).userProfileControllerFindOneByNationalId({
        nationalId: user.nationalId,
      })

      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      return {
        ...profile,

        // Temporary solution while we still run the old user profile service.
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
        canNudge: islyklarData?.canNudge,
        bankInfo: islyklarData?.bankInfo,
      }
    } catch (error) {
      if (error.status === 404) return null
      handleError(error)
    }
  }

  async createUserProfile(
    input: CreateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const createUserDto: CreateUserProfileDto = {
      nationalId: user.nationalId,
      //temporary as schemas where not working properly
      locale: input.locale as string,

      /* Mobile and email will be within islykill service */
      // mobilePhoneNumber: input.mobilePhoneNumber,
      // email: input.email,
    }
    const request: UserProfileControllerCreateRequest = {
      createUserProfileDto: createUserDto,
    }

    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )

    if (!feature) {
      handleError({ status: 'User profile create is feature flagged for user' })
    }

    await this.islyklarService
      .createIslykillSettings(user.nationalId, {
        email: input.email,
        mobile: input.mobilePhoneNumber,
        canNudge: input.canNudge,
      }) // Current version does not return the newly created user in the response.
      .catch(handleError)

    const userProfileResponse = await this.userProfileApiWithAuth(user)
      .userProfileControllerCreate(request)
      .catch(handleError)

    return userProfileResponse
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const updateUserDto: UpdateUserProfileDto = {
      //temporary as schemas where not working properly
      locale: input.locale as string,

      /* Mobile and email will be within islykill service */
      // mobilePhoneNumber: input.mobilePhoneNumber,
      // email: input.email,
    }
    const request: UserProfileControllerUpdateRequest = {
      nationalId: user.nationalId,
      updateUserProfileDto: updateUserDto,
    }

    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )

    if (!feature) {
      handleError({ status: 'User profile update is feature flagged for user' })
    }

    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )

    // if email exists and *only* mobile is updated, email will become undefined. And vice-versa.
    await this.islyklarService
      .updateIslykillSettings(user.nationalId, {
        email: input.email || islyklarData.email,
        mobile: input.mobilePhoneNumber || islyklarData.mobile,
        canNudge: input.canNudge,
        bankInfo: input.bankInfo,
      }) // Current version does not return the updated user in the response.
      .catch(handleError)

    return await this.userProfileApiWithAuth(user)
      .userProfileControllerUpdate(request)
      .catch(handleError)
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    const createSmsVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(user)
      .userProfileControllerCreateSmsVerification({ createSmsVerificationDto })
      .catch(handleError)
  }

  async resendEmailVerification(user: User): Promise<void> {
    await this.userProfileApiWithAuth(user)
      .userProfileControllerRecreateVerification({
        nationalId: user.nationalId,
      })
      .catch(handleError)
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmSmsDto } = input
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerConfirmSms({
        nationalId: user.nationalId,
        confirmSmsDto,
      })
      .catch(handleError)
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmEmailDto } = input
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerConfirmEmail({
        nationalId: user.nationalId,
        confirmEmailDto,
      })
      .catch(handleError)
  }

  async addDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerAddDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch(handleError)
  }

  async deleteDeviceToken(input: UserDeviceTokenInput, user: User) {
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerDeleteDeviceToken({
        nationalId: user.nationalId,
        deviceTokenDto: input,
      })
      .catch(handleError)
  }
}
