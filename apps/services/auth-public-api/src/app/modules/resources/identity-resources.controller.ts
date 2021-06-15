import { ResourcesService, IdentityResource } from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('api-scope')
@Controller('public/identity-resources')
export class IdentityResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [IdentityResource] })
  async findIdentityResourcesWithExplicitDelegationGrant(): Promise<
    IdentityResource[]
  > {
    return await this.resourcesService.findIdentityResourcesWithExplicitDelegationGrant()
  }
}
