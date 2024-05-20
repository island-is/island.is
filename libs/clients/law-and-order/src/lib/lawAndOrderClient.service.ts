import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class LawAndOrderClientService {
  constructor(private defaultApi: DefaultApi) {}

  private defaultApiWithAuth = (user: User) =>
    this.defaultApi.withMiddleware(new AuthMiddleware(user as Auth))

  getTest(user: User) {
    return this.defaultApiWithAuth(user).appControllerTest()
  }
}
