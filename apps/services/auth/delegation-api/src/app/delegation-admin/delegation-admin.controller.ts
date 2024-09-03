import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import {
  DelegationAdminCustomDto,
  DelegationAdminCustomService,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import flatMap from 'lodash/flatMap'
import { isDefined } from '@island.is/shared/utils'

const namespace = '@island.is/auth/delegation-admin'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(DelegationAdminScopes.read)
@ApiTags('delegation-admin')
@Controller('delegation-admin')
@Audit({ namespace })
export class DelegationAdminController {
  constructor(
    private readonly delegationAdminService: DelegationAdminCustomService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Documentation({
    response: { status: 200, type: DelegationAdminCustomDto },
    request: {
      header: {
        'X-Query-National-Id': {
          required: true,
          description: 'fetch delegations for this national id',
        },
      },
    },
  })
  @Audit<DelegationAdminCustomDto>({
    resources: (delegation) =>
      flatMap([
        ...delegation.incoming.map((d) => d.id ?? undefined),
        ...delegation.outgoing.map((d) => d.id ?? undefined),
      ]).filter(isDefined),
  })
  async getDelegationAdmin(
    @Headers('X-Query-National-Id') nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    return await this.delegationAdminService.getAllDelegationsByNationalId(
      nationalId,
    )
  }

  @Delete(':delegationId')
  @Scopes(DelegationAdminScopes.amdin)
  @Documentation({
    response: { status: 204 },
    request: {
      params: {
        delegationId: {
          required: true,
          description: 'The id of the delegation to delete',
        },
      },
    },
  })
  delete(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: delegationId,
        meta: (deleted) => ({
          deleted,
        }),
      },
      this.delegationAdminService.deleteDelegation(user, delegationId),
    )
  }
}
