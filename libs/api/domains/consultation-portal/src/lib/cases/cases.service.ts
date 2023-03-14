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
import { CaseItemResult } from '../models/caseItemResult.model'
import { AdviceResult } from '../models/adviceResult.model'
import { GetCasesInput } from '../dto/cases.input'
import { GetCaseAdviceInput } from '../dto/advice.input'

@Injectable()
export class CaseResultService {
  constructor(private casesApi: CasesApi) {}

  async getAllCases(): Promise<CaseItemResult[]> {
    const cases = await this.casesApi.apiCasesGet({})
    return cases
  }

  async getCases(input: GetCasesInput) {
    const request: ApiCasesGetRequest = {
      query: input.query,
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

  async postAdvice(input: GetCaseAdviceInput) {
    const request: ApiCasesCaseIdAdvicesPostRequest = {
      caseId: input.caseId,
      content: input.content,
      // files: input.files,
    }
    console.log(input)
    const response = await this.casesApi
      .apiCasesCaseIdAdvicesPost(request)
      .then((res) => console.log('then res', res))
      .catch((error) => console.error('Error', error))
    //return response
  }
}
