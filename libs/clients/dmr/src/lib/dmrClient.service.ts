import { AuthMiddleware, type User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerAdvertRequest,
  JournalControllerAdvertsRequest,
  JournalControllerApplicationRequest,
  JournalControllerCategoriesRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerInstitutionsRequest,
  JournalControllerMainCategoriesRequest,
  JournalControllerTypesRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async advert(params: JournalControllerAdvertRequest) {
    return this.dmrApi.journalControllerAdvert(params)
  }

  public async adverts(input: JournalControllerAdvertsRequest) {
    return this.dmrApi.journalControllerAdverts(input)
  }

  public async departments(params: JournalControllerDepartmentsRequest) {
    return this.dmrApi.journalControllerDepartments(params ?? {})
  }

  public async types(params: JournalControllerTypesRequest) {
    return this.dmrApi.journalControllerTypes(params)
  }

  public async mainCategories(params: JournalControllerMainCategoriesRequest) {
    return this.dmrApi.journalControllerMainCategories(params)
  }

  public async categories(params: JournalControllerCategoriesRequest) {
    return this.dmrApi.journalControllerCategories(params)
  }

  public async institutions(params: JournalControllerInstitutionsRequest) {
    return this.dmrApi.journalControllerInstitutions(params)
  }

  public async submitApplication(
    auth: User,
    params: JournalControllerApplicationRequest,
  ) {
    return this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerApplication(params)
  }
}
