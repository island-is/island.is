import {
  ResourceAccessService,
  ResourcesService,
  ApiScope,
} from '@island.is/auth-api-lib'
import {
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
  IdsAuthGuard,
} from '@island.is/auth-nest-tools'

@ApiTags('permissions')
@Controller({
  path: 'permissions',
  version: ['1', VERSION_NEUTRAL],
})
export class PermissionsController {
  constructor(
    private readonly accessService: ResourceAccessService,
    private readonly resourcesService: ResourcesService,
  ) {}

  /** Gets permitted scopes  */
  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes('@identityserver.api/authentication')
  @Get('permitted-scopes')
  @ApiOkResponse({ isArray: true })
  async findAllPermittedScopes(
    @CurrentUser() user: User,
    @Query(
      'requestedScopes',
      new ParseArrayPipe({ optional: false, items: String, separator: ',' }),
    )
    requestedScopes: string[],
  ): Promise<string[] | null> {
    const access = await this.accessService.findAll(
      user.nationalId,
      requestedScopes,
    )

    if (access) {
      return access.map((a) => a.scope)
    }

    return []
  }

  @UseGuards(IdsAuthGuard, ScopesGuard)
  @Scopes('@identityserver.api/authentication')
  @Get('access-controlled-scopes')
  @ApiOkResponse({ type: [ApiScope] })
  async findAllAccessControlledApiScopes(): Promise<ApiScope[] | null> {
    const accessControlledScopes =
      this.resourcesService.findAllAccessControlledApiScopes()
    return accessControlledScopes
  }
}
