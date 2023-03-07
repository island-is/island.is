import { Injectable } from '@nestjs/common'
import {
  CasesApi,
  ApiCasesCaseIdAdvicesGetRequest,
  ApiCasesCaseIdAdvicesPostRequest,
  ApiCasesCaseIdGetRequest,
} from '@island.is/clients/consultation-portal'
import { GetCaseInput } from '../dto/case.input'
import { CaseResult } from '../models/caseResult.model'
import { CaseItemResult } from '../models/caseItemResult.model'
import { AdviceResult } from '../models/adviceResult.model'
@Injectable()
export class CaseResultService {
  constructor(private casesApi: CasesApi) {}

  async getAllCases(): Promise<CaseItemResult[]> {
    const cases = await this.casesApi.apiCasesGet({})
    return cases
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

  async postAdvice(caseId: number, content: string, files: Blob[]) {
    const request: ApiCasesCaseIdAdvicesPostRequest = {
      caseId: caseId,
      content: content,
      files: files,
    }

    const response = await this.casesApi.apiCasesCaseIdAdvicesPost(request)
    return response
  }
}
