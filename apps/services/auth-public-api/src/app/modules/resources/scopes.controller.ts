import { ResourcesService, ApiScope } from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('scopes')
@Controller('v1/scopes')
export class ScopesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [ApiScope] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiInternalServerErrorResponse()
  async findAllWithExplicitDelegationGrant(
    @CurrentUser() user: User,
  ): Promise<ApiScope[]> {
    return this.resourcesService.findAllowedDelegationApiScopeListForUser(
      user.scope,
    )
  }
}
