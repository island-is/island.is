import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError, ForbiddenError } from 'apollo-server-express'

import {
  ActorLocaleLocaleEnum,
  ConfirmationDtoResponse,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileApi,
  UserProfileControllerCreateRequest,
  UserProfileControllerUpdateRequest,
  V2MeApi,
} from '@island.is/clients/user-profile'
import { handle204, handle404 } from '@island.is/clients/middlewares'

import { DeleteIslykillSettings } from './models/deleteIslykillSettings.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from './dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { UpdateEmailNotificationsInput } from './dto/updateEmailNotificationsInput'
import { DeleteIslykillValueInput } from './dto/deleteIslykillValueInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from './islykill.service'
import { UserDeviceTokenInput } from './dto/userDeviceTokenInput'
import { DataStatus } from './types/dataStatus.enum'

export const MAX_OUT_OF_DATE_MONTHS = 6

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
    private v2MeApi: V2MeApi,
    private readonly islyklarService: IslykillService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2UserProfileApiWithAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getIslykillProfile(user: User) {
    try {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      return {
        nationalId: user.nationalId,
        emailVerified: false,
        mobilePhoneNumberVerified: false,
        documentNotifications: false,
        emailStatus: DataStatus.NOT_VERIFIED,
        mobileStatus: DataStatus.NOT_VERIFIED,

        // Islyklar data:
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
        canNudge: islyklarData?.canNudge,
        bankInfo: islyklarData?.bankInfo,
      }
    } catch (e) {
      logger.error(JSON.stringify(e))
      return null
    }
  }

  async getUserProfileLocale(user: User) {
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
    try {
      const profile = await handle204(
        this.userProfileApiWithAuth(
          user,
        ).userProfileControllerFindOneByNationalIdRaw({
          nationalId: user.nationalId,
        }),
      )

      if (profile === null) {
        /**
         * Even if userProfileApiWithAuth does not exist.
         * Islykill data might exist for the user, so we need to get that, with default values in the userprofile data.
         */
        return await this.getIslykillProfile(user)
      }

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
      handle404(error)
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
      smsCode: input.smsCode,
      emailCode: input.emailCode,
      emailStatus: input.emailStatus,
      mobileStatus: input.mobileStatus,

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

    const userProfileResponse = await this.userProfileApiWithAuth(user)
      .userProfileControllerCreate(request)
      .catch((e) => handleError(e, `createUserProfile error`))

    if (input.email || input.mobilePhoneNumber) {
      const islyklarData = await this.islyklarService.getIslykillSettings(
        user.nationalId,
      )

      const emailVerified =
        userProfileResponse.emailStatus === DataStatus.VERIFIED
      const mobileVerified =
        userProfileResponse.mobileStatus === DataStatus.VERIFIED
      if (
        (input.email && !emailVerified) ||
        (input.mobilePhoneNumber && !mobileVerified)
      ) {
        throw new ForbiddenError('Updating value verification invalid')
      }

      if (islyklarData.noUserFound) {
        await this.islyklarService
          .createIslykillSettings(user.nationalId, {
            email: emailVerified ? input.email : undefined,
            mobile: mobileVerified ? input.mobilePhoneNumber : undefined,
          })
          .catch((e) =>
            handleError(e, `createUserProfile:createIslykillSettings error`),
          )
      } else {
        await this.islyklarService
          .updateIslykillSettings(user.nationalId, {
            email: emailVerified ? input.email : islyklarData.email,
            mobile: mobileVerified
              ? input.mobilePhoneNumber
              : islyklarData.mobile,
            bankInfo: islyklarData.bankInfo,
            canNudge: islyklarData.canNudge,
          }) // Current version does not return the updated user in the response.
          .catch((e) =>
            handleError(e, `createUserProfile:updateIslykillSettings error`),
          )
      }
    }

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
      smsCode: input.smsCode,
      emailCode: input.emailCode,

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

    const islyklarData = await this.islyklarService.getIslykillSettings(
      user.nationalId,
    )

    const updatedUserProfile = await this.userProfileApiWithAuth(user)
      .userProfileControllerUpdate(request)
      .catch((e) =>
        handleError(e, `updateUserProfile:userProfileControllerUpdate error`),
      )

    const emailVerified = updatedUserProfile.emailStatus === DataStatus.VERIFIED
    const mobileVerified =
      updatedUserProfile.mobileStatus === DataStatus.VERIFIED
    if (
      (input.email && !emailVerified) ||
      (input.mobilePhoneNumber && !mobileVerified)
    ) {
      throw new ForbiddenError('Updating value verification invalid')
    }

    if (islyklarData.noUserFound) {
      await this.islyklarService
        .createIslykillSettings(user.nationalId, {
          email:
            input.email && emailVerified ? input.email : islyklarData.email,
          mobile:
            input.mobilePhoneNumber && mobileVerified
              ? input.mobilePhoneNumber
              : islyklarData.mobile,
        })
        .catch((e) =>
          handleError(e, `updateUserProfile:createIslykillSettings error`),
        )
    } else {
      await this.islyklarService
        .updateIslykillSettings(user.nationalId, {
          email:
            input.email && emailVerified ? input.email : islyklarData.email,
          mobile:
            input.mobilePhoneNumber && mobileVerified
              ? input.mobilePhoneNumber
              : islyklarData.mobile,
          canNudge: input.canNudge ?? islyklarData.canNudge,
          bankInfo: input.bankInfo ?? islyklarData.bankInfo,
        })
        .catch((e) =>
          handleError(e, `updateUserProfile:updateIslykillSettings error`),
        )
    }

    return updatedUserProfile
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
    const createSmsVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(user)
      .userProfileControllerCreateSmsVerification({ createSmsVerificationDto })
      .catch((e) => handleError(e, `createSmsVerification error`))
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
      .catch((e) => handleError(e, `createEmailVerification error`))
  }

  async resendEmailVerification(user: User): Promise<void> {
    await this.userProfileApiWithAuth(user)
      .userProfileControllerRecreateVerification({
        nationalId: user.nationalId,
      })
      .catch((e) => handleError(e, `resendEmailVerification error`))
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
      .catch((e) => handleError(e, `confirmSms error`))
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
      .catch((e) => handleError(e, `confirmEmail error`))
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

  async updateEmailNotifications(
    input: UpdateEmailNotificationsInput,
    user: User,
  ) {
    return await this.v2UserProfileApiWithAuth(user)
      .meUserProfileControllerPatchUserProfile({
        patchUserProfileDto: {
          emailNotifications: input.emailNotifications,
        },
      })
      .catch((e) => handleError(e, `updateEmailNotifications error`))
  }
}
