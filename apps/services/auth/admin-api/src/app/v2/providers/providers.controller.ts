import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  Auth,
  CurrentAuth,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { idsAdminScopes } from '@island.is/auth/scopes'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import {
  DelegationProviderService,
  PaginatedDelegationProviderDto,
} from '@island.is/auth-api-lib'
import { AuditService } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(...idsAdminScopes)
@ApiSecurity('ias', idsAdminScopes)
@ApiTags('admin')
@Controller({
  path: '/providers',
  version: ['2'],
})
export class ProvidersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly delegationProviderService: DelegationProviderService,
  ) {}

  @Get()
  @Documentation({
    description: 'Fetch all delegationProviders and their delegationTypes',
    response: { status: 200, type: PaginatedDelegationProviderDto },
  })
  async getDelegationProviders(
    @CurrentAuth() auth: Auth,
  ): Promise<PaginatedDelegationProviderDto> {
    return this.auditService.auditPromise(
      {
        auth,
        action: 'getDelegationProviders',
        resources: (delegations) => delegations.data.map((d) => d.id),
      },
      this.delegationProviderService.findAll(),
    )
  }
}
