import { Injectable } from '@nestjs/common'

import {
  DelegationAdminApi,
  DelegationAdminCustomDto,
} from '@island.is/clients/auth/delegation-api'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class DelegationAdminService {
  constructor(private readonly delegationAdminApi: DelegationAdminApi) {}

  delegationsWithAuth(auth: Auth) {
    return this.delegationAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getDelegationAdmin(
    user: User,
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    return await this.delegationsWithAuth(
      user,
    ).delegationAdminControllerGetDelegationAdmin({
      xQueryNationalId: nationalId,
    })
  }
}
