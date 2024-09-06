import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApi,
  GetAdvertByIdRequest,
  GetAdvertsRequest,
  GetCategoriesRequest,
  GetDepartmentsRequest,
  GetInstitutionsRequest,
  GetMainCategoriesRequest,
  GetAdvertTypesRequest,
  GetDepartmentByIdRequest,
  GetAdvertTypeByIdRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class OfficialJournalOfIcelandClientService {
  constructor(private readonly api: OfficialJournalOfIcelandApi) {}

  public async getAdvertById(params: GetAdvertByIdRequest) {
    return this.api.getAdvertById(params)
  }

  public async getAdverts(input: GetAdvertsRequest) {
    return this.api.getAdverts(input)
  }

  public async getDepartmentById(params: GetDepartmentByIdRequest) {
    return this.api.getDepartmentById(params)
  }

  public async getDepartments(params: GetDepartmentsRequest) {
    return this.api.getDepartments(params ?? {})
  }

  public async getAdvertTypeById(params: GetAdvertTypeByIdRequest) {
    return this.api.getAdvertTypeById(params)
  }

  public async getAdvertTypes(params: GetAdvertTypesRequest) {
    return this.api.getAdvertTypes(params)
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
}
