import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  InlineResponse200,
  InlineResponse2001,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class InnaService {
  constructor(private readonly innaApi: DefaultApi) {}

  getPeriods = (user: User): Promise<InlineResponse2001 | null> =>
    this.innaApi
      .periodsSsnGet({
        ssn: user.nationalId,
        locale: 'is',
      })
      .catch(handle404)

  getDiplomas = (user: User): Promise<InlineResponse200 | null> =>
    this.innaApi
      .diplomainfolistSsnGet({
        ssn: user.nationalId,
        locale: 'is',
      })
      .catch(handle404)
}
