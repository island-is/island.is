import { ResourcesService, IdentityResource } from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('api-scope')
@Controller('v1/identity-resources')
export class IdentityResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [IdentityResource] })
  async findIdentityResourcesWithExplicitDelegationGrant(
    @CurrentUser() user: User,
  ): Promise<IdentityResource[]> {
    return this.resourcesService.findAllowedDelegationIdentityResourceListForUser(
      user.scope,
    )
  }
}
