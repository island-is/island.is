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
import { FileStorageService } from '@island.is/file-storage'
import { CaseAdviceCommand } from '../models/caseAdviceCommand.model'

@Injectable()
export class CasesService {
  constructor(
    private casesApi: CasesApi,
    private readonly fileStorageService: FileStorageService,
  ) {}

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
    const response = await this.casesApi.apiCasesCaseIdAdvicesGet(request)
    return response
  }

  async postAdvice(auth: User, input: PostAdviceInput) {
    const uploadUrls = await this.prepareDownloads(
      input.caseAdviceCommand?.fileUrls ? input.caseAdviceCommand.fileUrls : [],
    )

    const caseAdviceCommand: CaseAdviceCommand = {
      content: input.caseAdviceCommand?.content,
      fileUrls: uploadUrls,
    }

    const request: ApiCasesCaseIdAdvicesPostRequest = {
      caseId: input.caseId,
      caseAdviceCommand: caseAdviceCommand,
    }
    const response = await this.casesApiWithAuth(
      auth,
    ).apiCasesCaseIdAdvicesPost(request)
    return response
  }

  async getCase(input: GetCaseInput): Promise<CaseResult> {
    const request: ApiCasesCaseIdGetRequest = {
      caseId: input.caseId,
    }

    const response = await this.casesApi.apiCasesCaseIdGet(request)
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

    const response = await this.casesApi.apiCasesGet(request)
    return response
  }
}
