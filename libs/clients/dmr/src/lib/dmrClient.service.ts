import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerAdvertsRequest,
  JournalControllerDepartmentsRequest,
  JournalControllerTypesRequest,
} from '../../gen/fetch/apis'
import {
  JournalAdvert,
  JournalAdvertCategoriesResponse,
  JournalAdvertDepartmentsResponse,
  JournalAdvertTypesResponse,
  JournalAdvertsResponse,
} from '../../gen/fetch'

const BASE_PATH = 'http://localhost:3000/api/v1'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<JournalAdvertsResponse> {
    return await fetch(`${BASE_PATH}/adverts?search=${input.search}`).then(
      (res) => res.json() as Promise<JournalAdvertsResponse>,
    )
  }

  public async departments(
    auth: User,
    params?: JournalControllerDepartmentsRequest,
  ): Promise<JournalAdvertDepartmentsResponse> {
    return await fetch(`${BASE_PATH}/departments`).then((res) => res.json())
  }

  public async types(
    auth: User,
    params?: JournalControllerTypesRequest,
  ): Promise<JournalAdvertTypesResponse> {
    let query = ''
    if (params) {
      query = `?${Object.keys(params)
        .map((key) => `${key}=${params[key as keyof typeof params]}`)
        .join('&')}`
    }

    return await fetch(`${BASE_PATH}/types${query}`).then((res) => res.json())
  }

  public async categories(
    auth: User,
  ): Promise<JournalAdvertCategoriesResponse> {
    return await fetch(`${BASE_PATH}/categories`).then((res) => res.json())
  }
}
