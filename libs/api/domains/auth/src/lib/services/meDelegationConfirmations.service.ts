import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type { DelegationConfirmationAuthenticationDTO } from '@island.is/clients/auth/delegation-api'
import { MeDelegationConfirmationsApi } from '@island.is/clients/auth/delegation-api'

import type { DelegationConfirmationInput } from '../dto'

@Injectable()
export class MeDelegationConfirmationsService {
  constructor(
    private delegationConfirmationsApi: MeDelegationConfirmationsApi,
  ) {}

  private apiWithAuth(auth: Auth) {
    return this.delegationConfirmationsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  getAuthentication(
    user: User,
    { confirmationId }: DelegationConfirmationInput,
  ): Promise<DelegationConfirmationAuthenticationDTO> {
    return this.apiWithAuth(
      user,
    ).meDelegationConfirmationsControllerGetAuthentication({ confirmationId })
  }
}
