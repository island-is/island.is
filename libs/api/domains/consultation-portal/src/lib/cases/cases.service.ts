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

@Injectable()
export class CaseResultService {
  constructor(
    private casesApi: CasesApi,
    private readonly fileStorageService: FileStorageService,
  ) { }

  private casesApiWithAuth(auth: User) {
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

  // async postAdvice(auth: User, input: PostAdviceInput) {
  //   const request: ApiCasesCaseIdAdvicesPostRequest = {
  //     caseId: input.caseId,
  //     adviceRequest: input.adviceRequest,
  //   }
  //   const response = await this.casesApiWithAuth(
  //     auth,
  //   ).apiCasesCaseIdAdvicesPost(request)
  //   return response
  // }

  private async prepareDownloads(files: Array<string>): Promise<Array<string>> {
    const hasFiles = files?.length > 0

    if(!hasFiles) {
      return []
    }

    return await Promise.all(
      files.map(async (item) => {
        const objUrl = this.fileStorageService.getObjectUrl(item)
        const signedUrl = await this.fileStorageService.generateSignedUrl(objUrl)
        return signedUrl
      })
    )

  }


  async postAdvice(input: PostAdviceInput) {
    console.log('adviceRequest', input.adviceRequest)
    const adviceFiles = input.adviceRequest?.adviceFiles as Array<string>
    const test = await this.prepareDownloads(adviceFiles)
    console.log("test", test)
    // const mapped = input?.adviceRequest?.adviceFiles?.map((item) => {
    //   const objUrl = this.fileStorageService.getObjectUrl(item)

    //   const signedUrl = (this.fileStorageService.generateSignedUrl(objUrl))
    // })



    const request: any = {
      caseId: input.caseId,
      adviceRequest: input.adviceRequest,
    }
    const response = await this.casesApi.apiCasesCaseIdAdvicesPost(request)
    return response
  }
}
