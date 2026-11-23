import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { MeAppLoginsApi } from '@island.is/clients/auth/delegation-api'

import { AppLogin } from '../models/appLogin.model'

@Injectable()
export class AppLoginService {
  constructor(private readonly meAppLoginsApi: MeAppLoginsApi) {}

  private meAppLoginsApiWithAuth(auth: Auth): MeAppLoginsApi {
    return this.meAppLoginsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getAppLogins(user: User): Promise<AppLogin[]> {
    return this.meAppLoginsApiWithAuth(user).meAppLoginsControllerFindAll()
  }

  async revokeAppLogin(user: User, id: string): Promise<boolean> {
    await this.meAppLoginsApiWithAuth(user).meAppLoginsControllerDelete({ id })

    return true
  }
}
