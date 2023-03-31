import { Injectable } from '@nestjs/common'
import {
  CasesApi,
  ApiCasesCaseIdAdvicesGetRequest,
  ApiCasesCaseIdAdvicesPostRequest,
  ApiCasesCaseIdGetRequest,
  ApiCasesGetRequest,
} from '@island.is/clients/consultation-portal'
import { GetCaseInput } from '../dto/case.input'
import { CaseResult } from '../models/caseResult.model'
import { AdviceResult } from '../models/adviceResult.model'
import { GetCasesInput } from '../dto/cases.input'
import { CasesAggregateResult } from '../models/casesAggregateResult.model'
import { PostAdviceInput } from '../dto/postAdvice.input'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class CaseResultService {
  constructor(private casesApi: CasesApi) {}

  private postAdviceWithAuth(auth: User) {
    console.log("test", this.casesApi.withMiddleware(new AuthMiddleware(auth)))
    return this.casesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCases(input: GetCasesInput): Promise<CasesAggregateResult> {
    const request: ApiCasesGetRequest = {
      searchQuery: input.searchQuery,
      policyAreas: input.policyAreas,
      institutions: input.institutions,
      caseStatuses: input.caseStatuses,
      caseTypes: input.caseTypes,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      orderBy: input.orderBy,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
    }

    const response = await this.casesApi.apiCasesGet(request)
    return response
  }

  async getCase(input: GetCaseInput): Promise<CaseResult> {
    const request: ApiCasesCaseIdGetRequest = {
      caseId: input.caseId,
    }

    const response = await this.casesApi.apiCasesCaseIdGet(request)
    return response
  }

  async getAdvices(input: GetCaseInput): Promise<AdviceResult[]> {
    const request: ApiCasesCaseIdAdvicesGetRequest = {
      caseId: input.caseId,
    }
    const response = await this.casesApi.apiCasesCaseIdAdvicesGet(request)
    return response
  }

  async postAdvice(auth: User, input: PostAdviceInput) {
    const request: ApiCasesCaseIdAdvicesPostRequest = {
      caseId: input.caseId,
      adviceRequest: input.adviceRequest,
    }
    console.log("auth", auth)
    const response = await this.postAdviceWithAuth(
      auth,
    ).apiCasesCaseIdAdvicesPost(request)
    console.log("response", response)
    return response
  }
}
