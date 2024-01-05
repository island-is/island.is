import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminScopeService,
  AdminScopeDTO,
  MeTenantGuard,
  AdminCreateScopeDto,
  AdminPatchScopeDto,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/scopes'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/scopes',
  version: ['2'],
})
@Audit({ namespace })
export class MeScopesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly adminScopeService: AdminScopeService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all scopes by tenant id.',
    response: { status: 200, type: [AdminScopeDTO] },
  })
  @Audit<AdminScopeDTO[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  findAllByTenantId(@Param('tenantId') id: string): Promise<AdminScopeDTO[]> {
    return this.adminScopeService.findAllByTenantId(id)
  }

  @Get(':scopeName')
  @Documentation({
    description: 'Get scope by name and tenant id.',
    response: { status: 200, type: AdminScopeDTO },
  })
  @Audit<AdminScopeDTO>({
    resources: (scope) => scope.name,
  })
  findByTenantIdAndScopeName(
    @Param('tenantId') tenantId: string,
    @Param('scopeName') scopeName: string,
  ): Promise<AdminScopeDTO> {
    return this.adminScopeService.findByTenantIdAndScopeName({
      scopeName,
      tenantId,
    })
  }

  @Post()
  @Documentation({
    description: 'Creates api scope for specific tenant.',
    response: { status: 200, type: AdminScopeDTO },
  })
  @Audit<AdminScopeDTO>({
    resources: (scope) => scope.name,
    alsoLog: true,
  })
  create(
    @Param('tenantId') tenantId: string,
    @Body() input: AdminCreateScopeDto,
  ): Promise<AdminScopeDTO> {
    return this.adminScopeService.createScope(tenantId, input)
  }

  @Patch(':scopeName')
  @Documentation({
    description: 'Update a scope with partial set of properties.',
    response: { status: 200, type: AdminScopeDTO },
  })
  update(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Param('scopeName') scopeName: string,
    @Body() input: AdminPatchScopeDto,
  ): Promise<AdminScopeDTO> {
    return this.auditService.auditPromise<AdminScopeDTO>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: (scope) => scope.name,
        alsoLog: true,
        meta: {
          fields: Object.keys(input),
        },
      },
      this.adminScopeService.updateScope({
        tenantId,
        scopeName,
        input,
        user,
      }),
    )
  }
}
