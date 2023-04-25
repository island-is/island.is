import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'

@Injectable()
export class ConsentService {
  async getConsent(user: User): Promise<ConsentsPaginated> {
    // TODO: Get consents from IDS
    const data = [
      {
        clientId: '@reykjavik-web',
        consentedScopes: ['scope1, scope2'],
        rejectedScopes: ['scope3'],
      },
      {
        clientId: '@hms.is/minarsidur',
        consentedScopes: ['scope1, scope2'],
        rejectedScopes: ['scope3'],
      },
    ]

    return {
      totalCount: data.length,
      data: data,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }
}
