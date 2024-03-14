import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'

import {
  DelegationRecordDTO,
  DelegationsIndexService,
  PaginatedDelegationRecordDTO,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import {
  Auth,
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
const namespace = '@island.is/auth/delegation-api/delegations'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.delegationIndex)
@ApiSecurity('ias', [AuthScope.delegationIndex])
@Controller({
  path: 'delegations',
})
@Audit({ namespace })
export class DelegationsController {
  constructor(
    private readonly delegationIndexService: DelegationsIndexService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Documentation({
    description:
      'Fetch delegations from specific national id and scope from delegation index',
    response: { status: 200, type: [DelegationRecordDTO] },
    request: {
      header: {
        'X-Query-From-National-Id': {
          required: true,
          description: 'fetch delegations from this national id',
        },
      },
      query: {
        scope: {
          required: true,
          type: 'string',
          description: 'fetch delegations that have access to this scope',
        },
      },
    },
  })
  async getDelegationRecords(
    @CurrentAuth() auth: Auth,
    @Headers('X-Query-From-National-Id') fromNationalId: string,
    @Query('scope') scope: string,
  ): Promise<PaginatedDelegationRecordDTO> {
    return this.auditService.auditPromise(
      {
        auth,
        action: 'getDelegationRecords',
        resources: (delegations) => delegations.data.map((d) => d.toNationalId),
        meta: {
          scope,
          fromNationalId,
        },
      },
      this.delegationIndexService.getDelegationRecords({
        scope,
        fromNationalId,
      }),
    )
  }
}
