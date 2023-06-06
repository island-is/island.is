import { Inject, Injectable } from '@nestjs/common'
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
import { FileStorageService } from '@island.is/file-storage'
import { PostCaseAdviceCommand } from '../models/postCaseAdviceCommand.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'

@Injectable()
export class CasesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private casesApi: CasesApi,
    private readonly fileStorageService: FileStorageService,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'cases_service',
    }
    this.logger.error(errorDetail || 'Cases Service Error', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  private casesApiWithAuth(auth: User) {
    return this.casesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async prepareDownloads(files: Array<string>): Promise<Array<string>> {
    if (files?.length < 1) {
      return []
    }

    return await Promise.all(
      files.map(async (item) => {
        const objUrl = this.fileStorageService.getObjectUrl(item)
        const signedUrl = await this.fileStorageService.generateSignedUrl(
          objUrl,
        )
        return signedUrl
      }),
    )
  }

  async getAdvices(input: GetCaseInput): Promise<AdviceResult[]> {
    const request: ApiCasesCaseIdAdvicesGetRequest = {
      caseId: input.caseId,
    }

    const response = await this.casesApi
      .apiCasesCaseIdAdvicesGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get case advices'))

    if (!response || response instanceof ApolloError) {
      return []
    }

    return response
  }

  async postAdvice(auth: User, input: PostAdviceInput): Promise<void> {
    const uploadUrls = await this.prepareDownloads(
      input.postCaseAdviceCommand?.fileUrls
        ? input.postCaseAdviceCommand.fileUrls
        : [],
    )

    const postCaseAdviceCommand: PostCaseAdviceCommand = {
      content: input.postCaseAdviceCommand?.content,
      fileUrls: uploadUrls,
      privateAdvice: input.postCaseAdviceCommand?.privateAdvice,
    }

    const request: ApiCasesCaseIdAdvicesPostRequest = {
      caseId: input.caseId,
      postCaseAdviceCommand: postCaseAdviceCommand,
    }

    const response = await this.casesApiWithAuth(auth)
      .apiCasesCaseIdAdvicesPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post advice'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }

    return response
  }

  async getCase(input: GetCaseInput): Promise<CaseResult> {
    const request: ApiCasesCaseIdGetRequest = {
      caseId: input.caseId,
    }

    const response = await this.casesApi
      .apiCasesCaseIdGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get case detail'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
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

    const response = await this.casesApi
      .apiCasesGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get cases'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }
}
