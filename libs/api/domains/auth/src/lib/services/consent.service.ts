import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ConsentsApi } from '@island.is/clients/auth/ids-api'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'

@Injectable()
export class ConsentService {
  constructor(private readonly consentsApi: ConsentsApi) {}

  private consentsApiWithAuth(auth: Auth) {
    return this.consentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getConsent(user: User): Promise<ConsentsPaginated> {
    return this.consentsApiWithAuth(user).v1ActorConsentsGet()
  }
}
