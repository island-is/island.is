import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ScopesApi, ApiScope } from '@island.is/clients/auth-public-api'

@Injectable()
export class ApiScopeService {
  constructor(private scopesApi: ScopesApi) {}

  private scopesApiWithAuth(auth: Auth) {
    return this.scopesApi.withMiddleware(new AuthMiddleware(auth))
  }

  getApiScopes(user: User, lang: string): Promise<ApiScope[]> {
    return this.scopesApiWithAuth(
      user,
    ).scopesControllerFindAllWithExplicitDelegationGrant({ locale: lang })
  }
}
