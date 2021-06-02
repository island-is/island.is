import { ResourcesService, ApiScope } from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('api-scope')
@Controller('api-scope')
export class ApiScopeController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [ApiScope] })
  async findAllWithExplicitDelegationGrant(): Promise<ApiScope[]> {
    return await this.resourcesService.findApiScopesWithExplicitDelegationGrant()
  }
}
