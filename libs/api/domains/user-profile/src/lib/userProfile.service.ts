import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { UserProfileApi } from '../../gen/fetch'
import { UserProfile } from './userProfile.model'
import { UpdateUserProfileInput } from './dto/updateUserProfileInput'
import { CreateUserProfileInput } from './dto/createUserProfileInput'

const handleError = (error: any) => {
  logger.error(error)
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

  async createUser(input: CreateUserProfileInput): Promise<UserProfile> {
    const { ...createUserProfileDto } = input
    return await this.userProfileApi
      .userProfileControllerCreate({ createUserProfileDto })
      .catch(handleError)
  }

  async updateUser(input: UpdateUserProfileInput): Promise<UserProfile> {
    const { nationalId, ...updateUserProfileDto } = input
    return await this.userProfileApi
      .userProfileControllerUpdate({ nationalId, updateUserProfileDto })
      .catch(handleError)
  }
}
