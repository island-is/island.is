import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  AdminCreateTenantDto,
  AdminPatchTenantDto,
  Domain,
  MeTenantGuard,
  TenantDto,
  TenantsService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope, idsAdminScopes } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/admin-api/v2/tenants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: 'me/tenants',
  version: ['2'],
})
@Audit({ namespace })
export class MeTenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Scopes(...idsAdminScopes)
  @Documentation({
    description: 'Get all tenants for the current user.',
    response: { status: 200, type: [TenantDto] },
  })
  @Audit<TenantDto[]>({
    resources: (tenants) => tenants.map((tenant) => tenant.name),
  })
  findAll(@CurrentUser() user: User): Promise<TenantDto[]> {
    return this.tenantsService.findAllByUser(user)
  }

  @Get(':tenantId')
  @Scopes(...idsAdminScopes)
  @UseGuards(MeTenantGuard)
  @Documentation({
    description: 'Get tenant by id for the current user.',
    response: { status: 200, type: TenantDto },
  })
  @Audit<TenantDto>({
    resources: (tenant) => tenant.name,
  })
  findById(@Param('tenantId') tenantId: string): Promise<TenantDto> {
    return this.tenantsService.findById(tenantId)
  }

  @Get(':tenantId/admin-details')
  @Scopes(AdminPortalScope.idsAdminSuperUser)
  @UseGuards(MeTenantGuard)
  @Documentation({
    description:
      'Get the full tenant record for admin editing (super users only).',
    response: { status: 200, type: Domain },
  })
  @Audit<Domain>({
    resources: (tenant) => tenant.name,
  })
  findByIdForAdmin(@Param('tenantId') tenantId: string): Promise<Domain> {
    return this.tenantsService.findByIdForAdmin(tenantId)
  }

  @Post()
  @Scopes(AdminPortalScope.idsAdminSuperUser)
  @Documentation({
    description: 'Create a new tenant (super users only).',
    response: { status: 201, type: Domain },
  })
  create(
    @CurrentUser() user: User,
    @Body() input: AdminCreateTenantDto,
  ): Promise<Domain> {
    return this.auditService.auditPromise<Domain>(
      {
        auth: user,
        namespace,
        action: 'create',
        resources: (tenant) => tenant.name,
        alsoLog: true,
      },
      this.tenantsService.create(input),
    )
  }

  @Patch(':tenantId')
  @Scopes(AdminPortalScope.idsAdminSuperUser)
  @UseGuards(MeTenantGuard)
  @Documentation({
    description:
      'Update an existing tenant with a partial set of properties (super users only).',
    response: { status: 200, type: Domain },
  })
  update(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
    @Body() input: AdminPatchTenantDto,
  ): Promise<Domain> {
    return this.auditService.auditPromise<Domain>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (tenant) => tenant.name,
        alsoLog: true,
        meta: {
          fields: Object.keys(input),
        },
      },
      this.tenantsService.update(tenantId, input),
    )
  }

  @Delete(':tenantId')
  @Scopes(AdminPortalScope.idsAdminSuperUser)
  @HttpCode(204)
  @UseGuards(MeTenantGuard)
  @Documentation({
    description:
      'Delete a tenant (super users only). The tenant cannot be deleted if clients, scopes or scope groups still reference it.',
    response: { status: 204 },
  })
  delete(
    @CurrentUser() user: User,
    @Param('tenantId') tenantId: string,
  ): Promise<void> {
    return this.auditService.auditPromise<void>(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: tenantId,
        alsoLog: true,
      },
      this.tenantsService.delete(tenantId),
    )
  }
}
