import { Controller, Get, Headers, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import {
  DelegationOverviewDto,
  DelegationOverviewService,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import { Audit } from '@island.is/nest/audit'
import { DelegationAdminScopes } from '@island.is/auth/scopes'

import {
  auditableDelegationIds,
  parseQueryNationalId,
} from './query-national-id'

const namespace = '@island.is/auth/delegation-overview'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('me-delegation-overview')
@Controller('me/delegation-overview')
@Audit({ namespace })
export class MeDelegationOverviewController {
  constructor(
    private readonly delegationOverviewService: DelegationOverviewService,
  ) {}

  @Get()
  @Scopes(DelegationAdminScopes.institution)
  @Documentation({
    description:
      'Delegations a person has received or given that apply to clients owned by the current organisation.',
    response: { status: 200, type: DelegationOverviewDto },
    request: {
      header: {
        'X-Query-National-Id': {
          required: true,
          description: 'fetch delegations for this national id',
        },
      },
    },
  })
  @Audit<DelegationOverviewDto>({
    resources: (overview) =>
      auditableDelegationIds([...overview.incoming, ...overview.outgoing]),
  })
  getDelegationOverview(
    @CurrentUser() user: User,
    @Headers('X-Query-National-Id') nationalId: string,
  ): Promise<DelegationOverviewDto> {
    return this.delegationOverviewService.getDelegationsByNationalId(
      user,
      parseQueryNationalId(nationalId),
    )
  }
}
