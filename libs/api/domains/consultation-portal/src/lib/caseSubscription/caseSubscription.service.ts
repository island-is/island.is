import { Inject, Injectable } from '@nestjs/common'
import {
  CaseSubscriptionApi,
  ApiCaseSubscriptionCaseIdGetRequest,
  ApiCaseSubscriptionCaseIdPostRequest,
  ApiCaseSubscriptionCaseIdDeleteRequest,
} from '@island.is/clients/consultation-portal'
import { CaseSubscriptionResult } from '../models/caseSubscriptionResult.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { PostCaseSubscriptionTypeInput } from '../dto/postCaseSubscriptionType.input'
import { GetCaseInput } from '../dto/case.input'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class CaseSubscriptionService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private caseSubscriptionApi: CaseSubscriptionApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'case_subscription_service',
    }
    this.logger.error(errorDetail || 'Case Subscription Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  private caseSubscriptionApiWithAuth(auth: User) {
    return this.caseSubscriptionApi.withMiddleware(new AuthMiddleware(auth))
  }

  async deleteCaseSubscription(auth: User, input: GetCaseInput): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdDeleteRequest = {
      caseId: input.caseId,
    }

    const response = await this.caseSubscriptionApiWithAuth(auth)
      .apiCaseSubscriptionCaseIdDelete(requestParams)
      .catch((e) => this.handle4xx(e, 'failed to delete case subscription'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }

  async getCaseSubscriptionType(
    auth: User,
    input: GetCaseInput,
  ): Promise<CaseSubscriptionResult> {
    const requestParams: ApiCaseSubscriptionCaseIdGetRequest = {
      caseId: input.caseId,
    }

    const response = await this.caseSubscriptionApiWithAuth(auth)
      .apiCaseSubscriptionCaseIdGet(requestParams)
      .catch((e) => this.handle4xx(e, 'failed to get case subscription type'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async postCaseSubscriptionType(
    auth: User,
    input: PostCaseSubscriptionTypeInput,
  ): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdPostRequest = {
      caseId: input.caseId,
      postCaseSubscriptionCommand: input.postCaseSubscriptionCommand,
    }

    const response = await this.caseSubscriptionApiWithAuth(auth)
      .apiCaseSubscriptionCaseIdPost(requestParams)
      .catch((e) => this.handle4xx(e, 'failed to post case subscription type'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }
}
