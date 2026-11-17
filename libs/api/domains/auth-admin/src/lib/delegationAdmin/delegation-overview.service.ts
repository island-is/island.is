import { Injectable } from '@nestjs/common'

import {
  DelegationOverviewDto,
  MeDelegationOverviewApi,
} from '@island.is/clients/auth/admin-api'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class DelegationOverviewService {
  constructor(
    private readonly delegationOverviewApi: MeDelegationOverviewApi,
  ) {}

  getDelegationOverview(
    user: User,
    nationalId: string,
  ): Promise<DelegationOverviewDto> {
    return this.delegationOverviewApi
      .withMiddleware(new AuthMiddleware(user))
      .meDelegationOverviewControllerGetDelegationOverview({
        xQueryNationalId: nationalId,
      })
  }
}
