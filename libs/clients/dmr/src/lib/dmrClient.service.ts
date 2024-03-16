import { AuthMiddleware, type User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerAdvertRequest,
  JournalControllerAdvertsRequest,
  JournalControllerApplicationRequest,
  JournalControllerCategoriesRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerTypesRequest,
} from '../../gen/fetch/apis'
import {
  JournalAdvert,
  JournalAdvertCategoriesResponse,
  JournalAdvertDepartmentsResponse,
  JournalAdvertTypesResponse,
  JournalAdvertsResponse,
  JournalPostApplicationResponse,
} from '../../gen/fetch'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async advert(
    params: JournalControllerAdvertRequest,
  ): Promise<JournalAdvert> {
    return await this.dmrApi.journalControllerAdvert(params)
  }
  public async adverts(
    input: JournalControllerAdvertsRequest,
  ): Promise<JournalAdvertsResponse> {
    return await this.dmrApi.journalControllerAdverts(input)
  }

  public async departments(
    params: JournalControllerDepartmentsRequest,
  ): Promise<JournalAdvertDepartmentsResponse> {
    return await this.dmrApi.journalControllerDepartments(params ?? {})
  }

  public types(
    params: JournalControllerTypesRequest,
  ): Promise<JournalAdvertTypesResponse> {
    return this.dmrApi.journalControllerTypes(params)
  }

  public async categories(
    params: JournalControllerCategoriesRequest,
  ): Promise<JournalAdvertCategoriesResponse> {
    return await this.dmrApi.journalControllerCategories(params)
  }

  public async submitApplication(
    auth: User,
    params: JournalControllerApplicationRequest,
  ): Promise<JournalPostApplicationResponse> {
    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerApplication(params)
  }
}
