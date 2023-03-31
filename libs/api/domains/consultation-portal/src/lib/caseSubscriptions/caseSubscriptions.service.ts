import { Inject, Injectable } from '@nestjs/common'
import {
  CaseSubscriptionApi,
  ApiCaseSubscriptionCaseIdGetRequest,
  ApiCaseSubscriptionCaseIdPostRequest,
  PostCaseSubscriptionCommand,
  ApiCaseSubscriptionCaseIdDeleteRequest,
} from '@island.is/clients/consultation-portal'
import { CaseSubscriptionResult } from '../models/caseSubscriptionResult.model'

@Injectable()
export class CaseSubscriptionService {
  constructor(private caseSubscriptionApi: CaseSubscriptionApi) {}

  async getCaseSubscriptionType(
    caseId: number,
  ): Promise<CaseSubscriptionResult> {
    const requestParams: ApiCaseSubscriptionCaseIdGetRequest = {
      caseId: caseId,
    }
    const response = await this.caseSubscriptionApi.apiCaseSubscriptionCaseIdGet(
      requestParams,
    )

    return response
  }

  async postCaseSubscriptionType(
    caseId: number,
    input: PostCaseSubscriptionCommand,
  ): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdPostRequest = {
      caseId: caseId,
      postCaseSubscriptionCommand: input,
    }
    const response = await this.caseSubscriptionApi.apiCaseSubscriptionCaseIdPost(
      requestParams,
    )
    return response
  }

  async deleteCaseSubscription(caseId: number): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdDeleteRequest = {
      caseId: caseId,
    }

    const response = await this.caseSubscriptionApi.apiCaseSubscriptionCaseIdDelete(
      requestParams,
    )

    return response
  }
}
