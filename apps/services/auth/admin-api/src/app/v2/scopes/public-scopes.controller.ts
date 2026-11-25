import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AdminScopeService } from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'

import { PublicScopeDto } from './dto/public-scope.dto'

const ADMIN_TENANT_ID = '@admin.island.is'

@ApiTags('public')
@Controller({
  path: 'public/tenants/:tenantId/scopes',
  version: ['2'],
})
export class PublicScopesController {
  constructor(private readonly adminScopeService: AdminScopeService) {}

  @Get()
  @Documentation({
    description: 'Get the public scope summaries for a tenant.',
    response: { status: 200, type: [PublicScopeDto] },
  })
  async findAllByTenantId(
    @Param('tenantId') tenantId: string,
  ): Promise<PublicScopeDto[]> {
    if (tenantId === ADMIN_TENANT_ID) {
      return []
    }

    return this.adminScopeService.findAllPublicByTenantId(tenantId)
  }
}
