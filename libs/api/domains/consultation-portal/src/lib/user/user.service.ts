import {
  ApiUserAdvicesGetRequest,
  ApiUserEmailPostRequest,
  ApiUserSubscriptionsPostRequest,
  UserApi,
} from '@island.is/clients/consultation-portal'
import { Inject, Injectable } from '@nestjs/common'
import { GetUserAdvicesInput } from '../dto/userAdvices.input'
import { UserAdviceAggregate } from '../models/userAdviceAggregate.model'
import { UserEmailResult } from '../models/userEmailResult.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { UserSubscriptionsAggregate } from '../models/userSubscriptionsAggregate.model'
import { PostEmailCommand } from '../models/postEmailCommand.model'
import { PostUserSubscriptionsCommand } from '../models/postUserSubscriptionsCommand.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private userApi: UserApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'user_service',
    }
    this.logger.error(errorDetail || 'User Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

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

    const response = await this.userApiWithAuth(auth)
      .apiUserAdvicesGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get user advices'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async getUserEmail(auth: User): Promise<UserEmailResult> {
    const response = await this.userApiWithAuth(auth)
      .apiUserEmailGet()
      .catch((e) => this.handle4xx(e, 'failed to get user email'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async getUserSubscriptions(auth: User): Promise<UserSubscriptionsAggregate> {
    const response = await this.userApiWithAuth(auth)
      .apiUserSubscriptionsGet()
      .catch((e) => this.handle4xx(e, 'failed to get user supscriptions'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async postUserSubscriptions(
    auth: User,
    input: PostUserSubscriptionsCommand,
  ): Promise<void> {
    const request: ApiUserSubscriptionsPostRequest = {
      postUserSubscriptionsCommand: input,
    }

    const response = await this.userApiWithAuth(auth)
      .apiUserSubscriptionsPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post user subscriptions'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }
  async postUserEmail(auth: User, input: PostEmailCommand): Promise<void> {
    const request: ApiUserEmailPostRequest = {
      postEmailCommand: input,
    }

    const response = await this.userApiWithAuth(auth)
      .apiUserEmailPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post user email'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }
}
