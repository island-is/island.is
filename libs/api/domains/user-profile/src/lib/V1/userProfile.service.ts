import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ForbiddenError } from 'apollo-server-express'

import {
  ConfirmationDtoResponse,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileApi,
  UserProfileControllerCreateRequest,
  UserProfileControllerUpdateRequest,
} from '@island.is/clients/user-profile'
import { handle204, handle404 } from '@island.is/clients/middlewares'
import { UpdateUserProfileInput } from '../dto/updateUserProfileInput'
import { CreateUserProfileInput } from '../dto/createUserProfileInput'
import { CreateSmsVerificationInput } from '../dto/createSmsVerificationInput'
import { CreateEmailVerificationInput } from '../dto/createEmalVerificationInput'
import { ConfirmSmsVerificationInput } from '../dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from '../dto/confirmEmailVerificationInput'
import { UserProfile } from '../userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslykillService } from '../islykill.service'
import { DataStatus } from '../types/dataStatus.enum'

@Injectable()
export class UserProfileServiceV1 {
  constructor(
    private userProfileApi: UserProfileApi,
    private readonly islyklarService: IslykillService,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
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
        emailNotifications: islyklarData?.canNudge,
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

    const userProfileResponse = await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerCreate(request)

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
        await this.islyklarService.createIslykillSettings(user.nationalId, {
          email: emailVerified ? input.email : undefined,
          mobile: mobileVerified ? input.mobilePhoneNumber : undefined,
        })
      } else {
        await this.islyklarService.updateIslykillSettings(user.nationalId, {
          email: emailVerified ? input.email : islyklarData.email,
          mobile: mobileVerified
            ? input.mobilePhoneNumber
            : islyklarData.mobile,
          bankInfo: islyklarData.bankInfo,
          canNudge: islyklarData.canNudge,
        })
      }
    }

    return userProfileResponse
  }

  async updateMeUserProfile(
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

    const updatedUserProfile = await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerUpdate(request)

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
      await this.islyklarService.createIslykillSettings(user.nationalId, {
        email: input.email && emailVerified ? input.email : islyklarData.email,
        mobile:
          input.mobilePhoneNumber && mobileVerified
            ? input.mobilePhoneNumber
            : islyklarData.mobile,
      })
    } else {
      await this.islyklarService.updateIslykillSettings(user.nationalId, {
        email: input.email && emailVerified ? input.email : islyklarData.email,
        mobile:
          input.mobilePhoneNumber && mobileVerified
            ? input.mobilePhoneNumber
            : islyklarData.mobile,
        canNudge: input.canNudge ?? islyklarData.canNudge,
        bankInfo: input.bankInfo ?? islyklarData.bankInfo,
      })
    }

    return updatedUserProfile
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    user: User,
  ): Promise<void> {
    const createSmsVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerCreateSmsVerification({ createSmsVerificationDto })
  }

  async createEmailVerification(
    input: CreateEmailVerificationInput,
    user: User,
  ): Promise<void> {
    const createEmailVerificationDto = { nationalId: user.nationalId, ...input }
    await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerCreateEmailVerification({
      createEmailVerificationDto,
    })
  }

  async resendEmailVerification(user: User): Promise<void> {
    await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerRecreateVerification({
      nationalId: user.nationalId,
    })
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmSmsDto } = input
    return await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerConfirmSms({
      nationalId: user.nationalId,
      confirmSmsDto,
    })
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    user: User,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmEmailDto } = input
    return await this.userProfileApiWithAuth(
      user,
    ).userProfileControllerConfirmEmail({
      nationalId: user.nationalId,
      confirmEmailDto,
    })
  }
}
