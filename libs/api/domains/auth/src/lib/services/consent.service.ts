import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Consent, ConsentsApi } from '@island.is/clients/auth/ids-api'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'
import { PatchConsentInput } from '../dto/patchConsent.input'

@Injectable()
export class ConsentService {
  constructor(private readonly consentsApi: ConsentsApi) {}

  private consentsApiWithAuth(auth: Auth) {
    return this.consentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getConsent(user: User): Promise<ConsentsPaginated> {
    return this.consentsApiWithAuth(user).v1ActorConsentsGet()
  }

  patchConsent(user: User, input: PatchConsentInput): Promise<Consent> {
    if (!input.consentedScope && !input.rejectedScope) {
      throw new Error('Either consentedScope or rejectedScope must be provided')
    }

    return this.consentsApiWithAuth(user).v1ActorConsentsClientIdPatch({
      clientId: input.clientId,
      consentUpdate: {
        consented: input.consentedScope ? [input.consentedScope] : [],
        rejected: input.rejectedScope ? [input.rejectedScope] : [],
      },
    })
  }
}
