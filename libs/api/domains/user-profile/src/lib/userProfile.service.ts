import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ConfirmationDtoResponse, CreateUserProfileDto, UpdateUserProfileDto, UserProfileApi, UserProfileControllerCreateRequest, UserProfileControllerUpdateRequest } from '../../gen/fetch'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { UserProfile } from './userProfile.model'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(private userProfileApi: UserProfileApi) { }

  async getUser(nationalId: string): Promise<UserProfile> {
    return await this.userProfileApi
      .userProfileControllerFindOneByNationalId({ nationalId })
      .catch(handleError)
  }

  async createUser(
    input: CreateUserProfileInput,
    nationalId: string,
  ): Promise<UserProfile> {
    const createUserDto: CreateUserProfileDto = {
      nationalId: nationalId,
      //temporary as schemas where not working properly
      locale: input.locale as unknown as object,
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email
    }
    const request: UserProfileControllerCreateRequest = {
      createUserProfileDto: createUserDto
    }
    return await this.userProfileApi
      .userProfileControllerCreate(request)
      .catch(handleError)
  }

  async updateUser(
    input: UpdateUserProfileInput,
    nationalId: string,
  ): Promise<UserProfile> {
    const updateUserDto: UpdateUserProfileDto = {
      //temporary as schemas where not working properly
      locale: input.locale as unknown as object,
      mobilePhoneNumber: input.mobilePhoneNumber,
      email: input.email
    }
    const request: UserProfileControllerUpdateRequest = {
      nationalId: nationalId,
      updateUserProfileDto: updateUserDto
    }
    return await this.userProfileApi
      .userProfileControllerUpdate(request)
      .catch(handleError)
  }

  async createSmsVerification(
    input: CreateSmsVerificationInput,
    nationalId: string,
  ): Promise<void> {
    const createSmsVerificationDto = { nationalId, ...input }
    await this.userProfileApi
      .userProfileControllerCreateSmsVerification({ createSmsVerificationDto })
      .catch(handleError)
  }

  async confirmSms(
    input: ConfirmSmsVerificationInput,
    nationalId: string,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmSmsDto } = input
    return await this.userProfileApi
      .userProfileControllerConfirmSms({ nationalId, confirmSmsDto })
      .catch(handleError)
  }

  async confirmEmail(
    input: ConfirmEmailVerificationInput,
    nationalId: string,
  ): Promise<ConfirmationDtoResponse> {
    const { ...confirmEmailDto } = input
    return await this.userProfileApi
      .userProfileControllerConfirmEmail({ nationalId, confirmEmailDto })
      .catch(handleError)
  }
}
