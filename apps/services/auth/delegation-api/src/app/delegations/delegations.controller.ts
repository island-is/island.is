import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  DelegationDirection,
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
@ApiTags('delegations')
@Controller({
  path: 'delegations',
  version: ['1'],
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
    response: { status: 200, type: PaginatedDelegationRecordDTO },
    request: {
      header: {
        'X-Query-National-Id': {
          required: true,
          description: 'fetch delegations for this national id',
        },
      },
      query: {
        scope: {
          required: true,
          type: 'string',
          description: 'fetch delegations that have access to this scope',
        },
        direction: {
          description:
            'The direction of the delegation. Defaults to outgoing if not provided.',
          required: false,
          schema: {
            enum: [DelegationDirection.OUTGOING, DelegationDirection.INCOMING],
            default: DelegationDirection.OUTGOING,
          },
        },
      },
    },
  })
  async getDelegationRecords(
    @CurrentAuth() auth: Auth,
    @Headers('X-Query-National-Id') nationalId: string,
    @Query('scope') scope: string,
    @Query('direction') direction = DelegationDirection.OUTGOING,
  ): Promise<PaginatedDelegationRecordDTO> {
    return this.auditService.auditPromise(
      {
        auth,
        action: 'getDelegationRecords',
        resources: (delegations) => delegations.data.map((d) => d.toNationalId),
        meta: {
          scope,
          nationalId,
          direction,
        },
      },
      this.delegationIndexService.getDelegationRecords({
        scope,
        nationalId,
        direction,
      }),
    )
  }
}
