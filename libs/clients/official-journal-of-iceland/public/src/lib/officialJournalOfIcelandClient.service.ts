import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApi,
  GetAdvertByIdRequest,
  GetAdvertsRequest,
  GetCategoriesRequest,
  GetDepartmentsRequest,
  GetInstitutionsRequest,
  GetMainCategoriesRequest,
  GetDepartmentByIdRequest,
  GetCasesInProgressRequest,
  GetTypeByIdRequest,
  GetTypesRequest,
  GetMainTypesRequest,
  GetSimilarAdvertsByIdRequest,
} from '../../gen/fetch/apis'
import { GetAdvertMainTypes } from '../../gen/fetch'

@Injectable()
export class OfficialJournalOfIcelandClientService {
  constructor(private readonly api: OfficialJournalOfIcelandApi) {}

  public async getAdvertById(params: GetAdvertByIdRequest) {
    return this.api.getAdvertById(params)
  }

  public async getSimilarAdvertsById(params: GetSimilarAdvertsByIdRequest) {
    return this.api.getSimilarAdvertsById(params)
  }

  public async getAdverts(input: GetAdvertsRequest) {
    return this.api.getAdvertsLean(input)
  }

  public async getAdvertsFull(input: GetAdvertsRequest) {
    return this.api.getAdverts(input)
  }

  public async getDepartmentById(params: GetDepartmentByIdRequest) {
    return this.api.getDepartmentById(params)
  }

  public async getDepartments(params: GetDepartmentsRequest) {
    return this.api.getDepartments(params ?? {})
  }

  public async getAdvertTypeById(params: GetTypeByIdRequest) {
    return this.api.getTypeById(params)
  }

  public async getAdvertMainTypes(
    params: GetMainTypesRequest,
  ): Promise<GetAdvertMainTypes> {
    return this.api.getMainTypes(params)
  }

  public async getAdvertTypes(params: GetTypesRequest) {
    return this.api.getTypes(params)
  }

  public async getMainCategories(params: GetMainCategoriesRequest) {
    return this.api.getMainCategories(params)
  }

  public async getCategories(params: GetCategoriesRequest) {
    return this.api.getCategories(params)
  }

  public async getInstitutions(params: GetInstitutionsRequest) {
    return this.api.getInstitutions(params)
  }

  public async getCasesInProgress(params: GetCasesInProgressRequest) {
    return this.api.getCasesInProgress(params)
  }
}
