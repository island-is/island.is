import { Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import {
  Configuration,
  GetDetailedApi,
  GetSimpleApi,
  ResponseDetailed,
  ResponseSimple,
} from '../../gen/fetch'

@Injectable()
export class RskProcuringClient {
  private simpleApi: GetSimpleApi
  private detailedApi: GetDetailedApi

  constructor(configuration: Configuration) {
    this.simpleApi = new GetSimpleApi(configuration)
    this.detailedApi = new GetDetailedApi(configuration)
  }

  simpleApiWithAuth(auth: Auth) {
    return this.simpleApi.withMiddleware(new AuthMiddleware(auth))
  }

  detailedApiWithAuth(auth: Auth) {
    return this.detailedApi.withMiddleware(new AuthMiddleware(auth))
  }

  getSimple(user: User): Promise<ResponseSimple | null> {
    return this.simpleApiWithAuth(user)
      .simple({ nationalId: user.nationalId })
      .catch(this.handle404)
  }

  getDetailed(user: User): Promise<ResponseDetailed | null> {
    return this.detailedApiWithAuth(user)
      .detailed({ nationalId: user.nationalId })
      .catch(this.handle404)
  }

  private handle404(error: FetchError): null {
    if (error.name === 'FetchError' && error.status === 404) {
      return null
    }
    throw error
  }
}
