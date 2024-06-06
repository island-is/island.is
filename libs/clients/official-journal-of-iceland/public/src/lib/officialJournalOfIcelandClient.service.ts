import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApi,
  JournalControllerAdvertRequest,
  JournalControllerAdvertsRequest,
  JournalControllerCategoriesRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerInstitutionsRequest,
  JournalControllerMainCategoriesRequest,
  JournalControllerTypesRequest,
  JournalControllerDepartmentRequest,
  JournalControllerTypeRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class OfficialJournalOfIcelandClientService {
  constructor(private readonly api: OfficialJournalOfIcelandApi) {}

  public async advert(params: JournalControllerAdvertRequest) {
    return this.api.journalControllerAdvert(params)
  }

  public async adverts(input: JournalControllerAdvertsRequest) {
    return this.api.journalControllerAdverts(input)
  }

  public async department(params: JournalControllerDepartmentRequest) {
    return this.api.journalControllerDepartment(params)
  }

  public async departments(params: JournalControllerDepartmentsRequest) {
    return this.api.journalControllerDepartments(params ?? {})
  }

  public async type(params: JournalControllerTypeRequest) {
    return this.api.journalControllerType(params)
  }

  public async types(params: JournalControllerTypesRequest) {
    try {
      const result = await this.api.journalControllerTypes(params)

      console.log(result)

      return result
    } catch (error) {
      console.error(error)
      throw new Error('Something went wrong')
    }
  }

  public async mainCategories(params: JournalControllerMainCategoriesRequest) {
    return this.api.journalControllerMainCategories(params)
  }

  public async categories(params: JournalControllerCategoriesRequest) {
    return this.api.journalControllerCategories(params)
  }

  public async institutions(params: JournalControllerInstitutionsRequest) {
    return this.api.journalControllerInstitutions(params)
  }
}
