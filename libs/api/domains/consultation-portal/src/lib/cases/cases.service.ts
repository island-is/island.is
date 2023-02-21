import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import {
  CasesApi,
  ApiCasesCaseIdAdvicesGetRequest,
  ApiCasesCaseIdAdvicesPostRequest,
  ApiCasesGetRequest,
  ApiCasesCaseIdGetRequest,
} from '@island.is/clients/consultation-portal'

import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CaseResult } from '../models/caseResult.model'
import { CaseItemResult } from '../models/caseItemResult.model'
@Injectable()
export class CaseResultService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private casesApi: CasesApi,
  ) {}
  handleError(error: FetchError | ApolloError): void {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  async getAllCases(): Promise<CaseItemResult[]> {
    const cases = await this.casesApi.apiCasesGet({})
    return cases
  }
  // async getCases(): Promise<CaseResult[]> {
  //   const request: ApiCasesGetRequest = {}
  //   const response = await this.casesApi.apiCasesGet(request)
  //   return response
  // }

  async getCase(caseId: number): Promise<CaseResult> {
    const request: ApiCasesCaseIdGetRequest = {
      caseId: caseId,
    }

    const response = await this.casesApi.apiCasesCaseIdGet(request)
    return response
  }

  async getAdvices(caseId: number) {
    const request: ApiCasesCaseIdAdvicesGetRequest = {
      caseId: caseId,
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
