import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { UserProfileApi } from '../../gen/fetch'
import { UserProfile } from './userProfile.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'
import { CreateSmsVerificationInput } from './dto/createSmsVerificationInput'
import { ConfirmSmsVerificationInput } from './dto/confirmSmsVerificationInput'
import { ConfirmEmailVerificationInput } from './dto/confirmEmailVerificationInput'
import { ConfirmationDtoResponse } from '../../gen/fetch/models/ConfirmationDtoResponse'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class UserProfileService {
  constructor(private userProfileApi: UserProfileApi) {}

  async getUser(nationalId: string): Promise<UserProfile> {
    return await this.userProfileApi
      .userProfileControllerFindOneByNationalId({ nationalId })
      .catch(handleError)
  }

  async createUser(
    input: CreateUserProfileInput,
    nationalId: string,
  ): Promise<UserProfile> {
    const { ...createUserProfileDto } = { nationalId, ...input }

    return await this.userProfileApi
      .userProfileControllerCreate({ createUserProfileDto })
      .catch(handleError)
  }

  async updateUser(
    input: UpdateUserProfileInput,
    nationalId: string,
  ): Promise<UserProfile> {
    const { ...updateUserProfileDto } = { nationalId, ...input }

    return await this.userProfileApi
      .userProfileControllerUpdate({ updateUserProfileDto })
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
