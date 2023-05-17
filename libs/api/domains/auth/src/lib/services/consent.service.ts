import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Consent, ConsentsApi } from '@island.is/clients/auth/ids-api'

import { ConsentsPaginated } from '../dto/consentsPaginated.response'
import { PatchConsentInput } from '../dto/updateConsent.input'

@Injectable()
export class ConsentService {
  constructor(private readonly consentsApi: ConsentsApi) {}

  private consentsApiWithAuth(auth: Auth) {
    return this.consentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getConsent(user: User): Promise<ConsentsPaginated> {
    return this.consentsApiWithAuth(user).v1ActorConsentsGet()
  }

  updateConsent(user: User, input: PatchConsentInput): Promise<Consent> {
    return this.consentsApiWithAuth(user).v1ActorConsentsClientIdPatch({
      clientId: input.clientId,
      consentUpdate: {
        consented: input.consentedScopes,
        rejected: input.rejectedScopes,
      },
    })
  }
}
