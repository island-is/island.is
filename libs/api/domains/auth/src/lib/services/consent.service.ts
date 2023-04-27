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

  async getConsent(user: User): Promise<ConsentsPaginated> {
    const response = await this.consentsApiWithAuth(user).v1ActorConsentsGet()

    const consents = response.consents ?? []

    return {
      totalCount: consents.length,
      data: consents.map((c) => ({
        clientId: c.clientId ?? '',
        consentedScopes: c.consentedScopes ?? [],
        rejectedScopes: c.rejectedScopes ?? [],
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }
}
