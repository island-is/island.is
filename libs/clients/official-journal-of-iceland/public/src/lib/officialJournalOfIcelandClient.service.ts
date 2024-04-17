import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalApi,
  JournalControllerAdvertRequest,
  JournalControllerAdvertsRequest,
  JournalControllerCategoriesRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerInstitutionsRequest,
  JournalControllerMainCategoriesRequest,
  JournalControllerTypesRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class OfficialJournalOfIcelandClientService {
  constructor(private readonly api: OfficialJournalApi) {}

  public async advert(params: JournalControllerAdvertRequest) {
    return this.api.journalControllerAdvert(params)
  }

  public async adverts(input: JournalControllerAdvertsRequest) {
    return this.api.journalControllerAdverts(input)
  }

  public async departments(params: JournalControllerDepartmentsRequest) {
    return this.api.journalControllerDepartments(params ?? {})
  }

  public async types(params: JournalControllerTypesRequest) {
    return this.api.journalControllerTypes(params)
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
