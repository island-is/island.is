import {
  AccessService,
  ResourcesService,
  ApiScope,
} from '@island.is/auth-api-lib'
import {
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentUser,
} from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly accessService: AccessService,
    private readonly resourcesService: ResourcesService,
  ) {}

  /** Gets permitted scopes  */
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

  @Scopes('@identityserver.api/authentication')
  @Get('access-controlled-scopes')
  @ApiOkResponse({ type: [ApiScope] })
  async findAllAccessControlledApiScopes(): Promise<ApiScope[] | null> {
    const accessControlledScopes = this.resourcesService.findAllAccessControlledApiScopes()
    return accessControlledScopes
  }
}
