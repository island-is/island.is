import {
  GetAdvertsRequest,
  GetCasesInProgressRequest,
  OfficialJournalOfIcelandClientService,
} from '@island.is/clients/official-journal-of-iceland'
import { Injectable } from '@nestjs/common'
import {
  AdvertSingleParams,
  QueryParams,
  TypeQueryParams,
  MainTypesQueryParams,
  AdvertSimilarParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentsResponse,
  AdvertInstitutionsResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsFullResponse,
  AdvertSimilarResponse,
  AdvertsResponse,
  AdvertTypesResponse,
  MainTypesResponse,
} from './models/advert.response'
import { CasesInProgressResponse } from './models/cases.response'

@Injectable()
export class OfficialJournalOfIcelandService {
  constructor(
    private readonly ojoiService: OfficialJournalOfIcelandClientService,
  ) {}

  async getDepartmentById(params: AdvertSingleParams) {
    return await this.ojoiService.getDepartmentById(params)
  }

  async getDepartments(
    params: QueryParams,
  ): Promise<AdvertDepartmentsResponse> {
    return await this.ojoiService.getDepartments(params)
  }

  async getMainCategories(
    params: QueryParams,
  ): Promise<AdvertMainCategoriesResponse> {
    return await this.ojoiService.getMainCategories(params)
  }

  async getCategories(params: QueryParams): Promise<AdvertCategoryResponse> {
    return await this.ojoiService.getCategories(params)
  }

  async getAdvertTypeById(params: AdvertSingleParams) {
    return await this.ojoiService.getAdvertTypeById(params)
  }

  async getAdvertTypes(params: TypeQueryParams): Promise<AdvertTypesResponse> {
    return await this.ojoiService.getAdvertTypes(params)
  }

  async getMainTypes(params: MainTypesQueryParams): Promise<MainTypesResponse> {
    return await this.ojoiService.getAdvertMainTypes(params)
  }

  async getInstitutions(
    params: QueryParams,
  ): Promise<AdvertInstitutionsResponse> {
    return await this.ojoiService.getInstitutions(params)
  }

  async getAdvertById(params: AdvertSingleParams): Promise<AdvertResponse> {
    return await this.ojoiService.getAdvertById(params)
  }

  async getSimilarAdvertsById(
    params: AdvertSimilarParams,
  ): Promise<AdvertSimilarResponse> {
    return await this.ojoiService.getSimilarAdvertsById(params)
  }

  async getAdverts(input: GetAdvertsRequest): Promise<AdvertsResponse> {
    return await this.ojoiService.getAdverts(input)
  }

  async getAdvertsFull(input: GetAdvertsRequest): Promise<AdvertsFullResponse> {
    return await this.ojoiService.getAdvertsFull(input)
  }

  async getCasesInProgress(
    input: GetCasesInProgressRequest,
  ): Promise<CasesInProgressResponse> {
    return await this.ojoiService.getCasesInProgress(input)
  }
}
