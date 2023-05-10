import {
  ApiUserAdvicesGetRequest,
  ApiUserEmailPostRequest,
  ApiUserSubscriptionsPostRequest,
  UserApi,
} from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { UserEmailResult } from '../models/userEmailResult.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserSubscriptionsAggregate } from '../models/userSubscriptionsAggregate.model'
import { PostEmailCommand } from '../models/postEmailCommand.model'
import { UserSubscriptionsCommand } from '../models/userSubscriptionsCommand.model'

@Injectable()
export class UserService {
  constructor(private userApi: UserApi) {}

  private userApiWithAuth(auth: User) {
    return this.userApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getAllUserAdvices(
    auth: User,
    input: GetUserAdvicesInput,
  ): Promise<UserAdviceAggregate> {
    const request: ApiUserAdvicesGetRequest = {
      searchQuery: input.searchQuery,
      oldestFirst: input.oldestFirst,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
    }

    const advicesResponse = await this.userApiWithAuth(auth).apiUserAdvicesGet(
      request,
    )
    return advicesResponse
  }

  async getUserEmail(auth: User): Promise<UserEmailResult> {
    const emailResponse = await this.userApiWithAuth(auth).apiUserEmailGet()
    return emailResponse
  }

  async getUserSubscriptions(auth: User): Promise<UserSubscriptionsAggregate> {
    const response = await this.userApiWithAuth(auth).apiUserSubscriptionsGet()
    return response
  }

  async postUserSubscriptions(
    auth: User,
    input: UserSubscriptionsCommand,
  ): Promise<void> {
    const request: ApiUserSubscriptionsPostRequest = {
      userSubscriptionsCommand: input,
    }

    const response = await this.userApiWithAuth(auth).apiUserSubscriptionsPost(
      request,
    )
    return response
  }
  async postUserEmail(auth: User, input: PostEmailCommand): Promise<void> {
    const request: ApiUserEmailPostRequest = {
      postEmailCommand: input,
    }
    const response = await this.userApiWithAuth(auth).apiUserEmailPost(request)
    return response
  }
}
