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
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from './islykill.service'
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

  async getIslykillProfile(user: User) {
    try {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const feature = await this.featureFlagService.getValue(
        Features.personalInformation,
        false,
        user,
      )
      if (!feature) {
        return null
      }

      return {
        nationalId: user.nationalId,
        emailVerified: false,
        mobilePhoneNumberVerified: false,
        documentNotifications: false,
        emailStatus: 'NOT_VERIFIED',
        mobileStatus: 'NOT_VERIFIED',

        // Islyklar data:
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
        canNudge: islyklarData?.canNudge,
        bankInfo: islyklarData?.bankInfo,
      }
    } catch (error) {
      logger.error(JSON.stringify(error))
      return null
    }
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

      const feature = await this.featureFlagService.getValue(
        Features.personalInformation,
        false,
        user,
      )

      return {
        ...profile,

        // Temporary solution while we still run the old user profile service.
        ...(feature && {
          mobilePhoneNumber: islyklarData?.mobile,
          email: islyklarData?.email,
          canNudge: islyklarData?.canNudge,
          bankInfo: islyklarData?.bankInfo,
        }),
      }
    } catch (error) {
      if (error.status === 404) {
        /**
         * Even if userProfileApiWithAuth does not exist.
         * Islykill data might exist for the user, so we need to get that, with default values in the userprofile data.
         */
        return await this.getIslykillProfile(user)
      }
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

      /**
       *  Mobile and email will be within islykill service
       *  Only here for verification purposes in userProfile.controller.
       *  Will be removed in controller before saving to db
       */
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
    }
    const request: UserProfileControllerCreateRequest = {
      createUserProfileDto: createUserDto,
    }

    const feature = await this.featureFlagService.getValue(
      Features.personalInformation,
      false,
      user,
    )

    if (feature && (input.email || input.mobilePhoneNumber)) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      if (islyklarData.nationalId) {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email: input.email ?? islyklarData.email,
            mobile: input.mobilePhoneNumber ?? islyklarData.mobile,
            bankInfo: islyklarData.bankInfo,
            canNudge: islyklarData.canNudge,
          }) // Current version does not return the updated user in the response.
          .catch(handleError)
      } else {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email: input.email,
            mobile: input.mobilePhoneNumber,
          }) // Current version does not return the newly created user in the response.
          .catch(handleError)
      }
    } else {
      logger.info('User profile create is feature flagged for user')
    }

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
      documentNotifications: input.documentNotifications,

      /**
       *  Mobile and email will be within islykill service
       *  Only here for verification purposes in userProfile.controller.
       *  Will be removed in controller before saving to db
       */
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
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

    if (feature) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      if (islyklarData.nationalId) {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email: input.email ?? islyklarData.email,
            mobile: input.mobilePhoneNumber ?? islyklarData.mobile,
            canNudge: input.canNudge ?? islyklarData.canNudge,
            bankInfo: input.bankInfo ?? islyklarData.bankInfo,
          }) // Current version does not return the updated user in the response.
          .catch(handleError)
      } else {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email: input.email,
            mobile: input.mobilePhoneNumber,
          }) // Current version does not return the newly created user in the response.
          .catch(handleError)
      }
    } else {
      logger.info('User profile update is feature flagged for user')
    }

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

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    const createEmailVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(user)
      .userProfileControllerCreateEmailVerification({
        createEmailVerificationDto,
      })
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
