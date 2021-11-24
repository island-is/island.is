import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  ConfirmationDtoResponse,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserProfileApi,
  UserProfileControllerCreateRequest,
  UserProfileControllerUpdateRequest,
} from '../../gen/fetch'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { UserProfile } from './userProfile.model'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { IslyklarApi } from '@island.is/clients/islykill'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(
    private userProfileApi: UserProfileApi,
    private readonly islyklarApi: IslyklarApi,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getIslyklarData(ssn: User['nationalId']) {
    try {
      const islyklarData = await this.islyklarApi.islyklarGet({
        ssn,
      })

      return {
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
      }
    } catch (e) {
      return null // Do nothing to prevent blocking of getUserProfile.
    }
  }

  async getUserProfile(user: User) {
    try {
      const profile = await this.userProfileApiWithAuth(
        user,
      ).userProfileControllerFindOneByNationalId({
        nationalId: user.nationalId,
      })

      const islyklarData = await this.getIslyklarData(user.nationalId)

      return {
        ...profile,
        // Temporary solution while we still run the old user profile service.
        mobilePhoneNumber:
          islyklarData?.mobilePhoneNumber ?? profile.mobilePhoneNumber,
        email: islyklarData?.email ?? profile.email,
        mobilePhoneNumberVerified: islyklarData?.mobilePhoneNumber
          ? true
          : profile.mobilePhoneNumberVerified,
        emailVerified: islyklarData?.email ? true : profile.emailVerified,
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
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
    }
    const request: UserProfileControllerCreateRequest = {
      createUserProfileDto: createUserDto,
    }
    return await this.userProfileApiWithAuth(user)
      .userProfileControllerCreate(request)
      .catch(handleError)
  }

  async updateUserProfile(
    input: UpdateUserProfileInput,
    user: User,
  ): Promise<UserProfile> {
    const updateUserDto: UpdateUserProfileDto = {
      //temporary as schemas where not working properly
      locale: input.locale as string,
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email,
    }
    const request: UserProfileControllerUpdateRequest = {
      nationalId: user.nationalId,
      updateUserProfileDto: updateUserDto,
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
}
