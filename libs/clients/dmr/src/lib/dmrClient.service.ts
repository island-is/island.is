import { AuthMiddleware, type User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerAdvertsRequest,
  JournalControllerApplicationRequest,
  JournalControllerCategoriesRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerTypesRequest,
} from '../../gen/fetch/apis'
import {
  JournalAdvertCategoriesResponse,
  JournalAdvertDepartmentsResponse,
  JournalAdvertTypesResponse,
  JournalAdvertsResponse,
  JournalPostApplicationResponse,
} from '../../gen/fetch'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<JournalAdvertsResponse> {
    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerAdverts(input)
  }

  public async departments(
    auth: User,
    params: JournalControllerDepartmentsRequest,
  ): Promise<JournalAdvertDepartmentsResponse> {
    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerDepartments(params ?? {})
  }

  public types(
    auth: User,
    params: JournalControllerTypesRequest,
  ): Promise<JournalAdvertTypesResponse> {
    return this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerTypes(params)
  }

  public async categories(
    auth: User,
    params: JournalControllerCategoriesRequest,
  ): Promise<JournalAdvertCategoriesResponse> {
    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth as User))
      .journalControllerCategories(params)
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
