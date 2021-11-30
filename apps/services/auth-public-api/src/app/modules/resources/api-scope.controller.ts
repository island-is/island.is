import { ResourcesService, ApiScope } from '@island.is/auth-api-lib'
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
@Controller('v1/api-scope')
export class ApiScopeController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [ApiScope] })
  async findAllWithExplicitDelegationGrant(
    @CurrentUser() user: User,
  ): Promise<ApiScope[]> {
    return this.resourcesService.findAllowedDelegationApiScopeListForUser(
      user.scope,
    )
  }
}
