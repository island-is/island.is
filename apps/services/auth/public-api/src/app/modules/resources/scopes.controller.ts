import { ResourcesService, ApiScope } from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('scopes')
@Controller('v1/scopes')
export class ScopesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @Documentation({
    isAuthorized: true,
    request: {
      query: {
        locale: { type: String, required: false },
      },
    },
    response: {
      type: [ApiScope],
    },
  })
  async findAllWithExplicitDelegationGrant(
    @CurrentUser() user: User,
    @Query('locale') locale?: string,
  ): Promise<ApiScope[]> {
    return this.resourcesService.findAllowedDelegationApiScopeListForUser(
      user.scope,
      user,
      locale,
    )
  }
}
