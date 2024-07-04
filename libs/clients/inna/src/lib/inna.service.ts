import { User, Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  InlineResponse200,
  InlineResponse2001,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class InnaClientService {
  constructor(private readonly innaApi: DefaultApi) {}

  private getInnaWithAuth(auth: Auth) {
    return this.innaApi.withMiddleware(new AuthMiddleware(auth))
  }

  getPeriods = (auth: User): Promise<InlineResponse2001 | null> =>
    this.getInnaWithAuth(auth)
      .periodsGet({
        locale: 'is',
      })
      .catch(handle404)

  getDiplomas = (auth: User): Promise<InlineResponse200 | null> =>
    this.getInnaWithAuth(auth)
      .diplomainfolistGet({
        locale: 'is',
      })
      .catch(handle404)
}
