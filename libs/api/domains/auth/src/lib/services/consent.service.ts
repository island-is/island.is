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
    const response = await this.consentsApiWithAuth(user).consentsGet()

    const consents = response.consents ?? []
    // TODO: Get consents from IDS
    // const data = [
    //   {
    //     clientId: '@reykjavik-web',
    //     consentedScopes: ['scope1, scope2'],
    //     rejectedScopes: ['scope3'],
    //   },
    //   {
    //     clientId: '@hms.is/minarsidur',
    //     consentedScopes: ['scope1, scope2'],
    //     rejectedScopes: ['scope3'],
    //   },
    // ]

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
