import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import flatMap from 'lodash/flatMap'

import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  ZendeskAuthGuard,
} from '@island.is/auth-nest-tools'
import {
  CreatePaperDelegationDto,
  DelegationAdminCustomDto,
  DelegationAdminCustomService,
  DelegationDTO,
  ZendeskWebhookInputDto,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import { Audit, AuditService } from '@island.is/nest/audit'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import { isDefined } from '@island.is/shared/utils'

import env from '../../../environments/environment'

const namespace = '@island.is/auth/delegation-admin'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegation-admin')
@Controller('delegation-admin')
@Audit({ namespace })
export class DelegationAdminController {
  constructor(
    private readonly delegationAdminService: DelegationAdminCustomService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Scopes(DelegationAdminScopes.read)
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

  @Post()
  @Scopes(DelegationAdminScopes.admin)
  @Documentation({
    response: { status: 201, type: DelegationDTO },
  })
  create(
    @CurrentUser() user: User,
    @Body() delegation: CreatePaperDelegationDto,
  ): Promise<DelegationDTO> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'create',
        resources: (result) => {
          return result?.id ?? undefined
        },
      },
      this.delegationAdminService.createDelegation(user, delegation),
    )
  }

  @BypassAuth()
  @UseGuards(new ZendeskAuthGuard(env.zendeskGeneralMandateWebhookSecret))
  @Post('/zendesk')
  @Documentation({
    response: { status: 200 },
  })
  async createByZendeskId(
    @Body() { id }: ZendeskWebhookInputDto,
  ): Promise<void> {
    await this.auditService.auditPromise<DelegationDTO>(
      {
        system: true,
        namespace,
        action: 'createByZendeskId',
        resources: (res) => {
          return `id: ${res.id ?? 'Unknown'}, toNationalId: ${
            res.toNationalId ?? 'Unknown'
          }, fromNationalId: ${
            res.fromNationalId ?? 'Unknown'
          }, createdByNationalId: ${res.createdByNationalId ?? 'Unknown'}`
        },
        meta: {
          id,
        },
      },
      this.delegationAdminService.createDelegationByZendeskId(id),
    )
  }

  @BypassAuth()
  @UseGuards(new ZendeskAuthGuard(env.zendeskDeleteGeneralMandateWebhookSecret))
  @Post('/revert-zendesk')
  @Documentation({
    response: { status: 200 },
  })
  async deleteByZendeskId(
    @Body() { id }: ZendeskWebhookInputDto,
  ): Promise<void> {
    await this.auditService.auditPromise<boolean>(
      {
        system: true,
        namespace,
        action: 'deleteByZendeskId',
        resources: id,
        meta: (deleted) => ({
          deleted,
        }),
      },
      this.delegationAdminService.deleteDelegationByZendeskId(id),
    )
  }

  @Delete(':delegationId')
  @Scopes(DelegationAdminScopes.admin)
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
