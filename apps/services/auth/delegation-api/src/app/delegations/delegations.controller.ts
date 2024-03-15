import {
  Controller,
  Get,
  Headers,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'

import {
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
      'Fetch delegations from specific national id and scopes from delegation index',
    response: { status: 200, type: [PaginatedDelegationRecordDTO] },
    request: {
      header: {
        'X-Query-From-National-Id': {
          required: true,
          description: 'fetch delegations from this national id',
        },
      },
      query: {
        scopes: {
          required: true,
          type: '[string]',
          description:
            'fetch delegations that have access to these scopes, scopes are comma separated',
        },
      },
    },
  })
  async getDelegationRecords(
    @CurrentAuth() auth: Auth,
    @Headers('X-Query-From-National-Id') fromNationalId: string,
    @Query('scopes', new ParseArrayPipe({ items: String, separator: ',' }))
    scopes: string[],
  ): Promise<PaginatedDelegationRecordDTO> {
    return this.auditService.auditPromise(
      {
        auth,
        action: 'getDelegationRecords',
        resources: (delegations) => delegations.data.map((d) => d.toNationalId),
        meta: {
          scopes,
          fromNationalId,
        },
      },
      this.delegationIndexService.getDelegationRecords({
        scopes,
        fromNationalId,
      }),
    )
  }
}
