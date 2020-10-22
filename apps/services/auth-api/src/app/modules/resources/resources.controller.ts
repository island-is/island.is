import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseArrayPipe,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger'
import {
  IdentityResource,
  ResourcesService,
  ApiScope,
  ApiResource,
  Scopes,
  ScopesGuard,
  IdsAuthGuard,
} from '@island.is/auth-api-lib'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('resources')
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Scopes('@identityserver.api/authentication')
  @Get('identity-resources')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  async FindIdentityResourcesByScopeName(
    @Query(
      'scopeNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    scopeNames: string[],
  ): Promise<IdentityResource[]> {
    const identityResources = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames,
    )

    return identityResources
  }

  @Scopes('@identityserver.api/authentication')
  @Get('api-scopes')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  async FindApiScopesByNameAsync(
    @Query(
      'scopeNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    scopeNames: string[],
  ): Promise<ApiScope[]> {
    const apiScopes = await this.resourcesService.findApiScopesByNameAsync(
      scopeNames,
    )

    return apiScopes
  }

  @Scopes('@identityserver.api/authentication')
  @Get('api-resources')
  @ApiQuery({ name: 'apiResourceNames', required: false })
  @ApiQuery({ name: 'apiScopeNames', required: false })
  @ApiOkResponse({ type: ApiResource, isArray: true })
  async FindApiResourcesByNameAsync(
    @Query(
      'apiResourceNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    apiResourceNames: string[],
    @Query(
      'apiScopeNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    apiScopeNames: string[],
  ): Promise<ApiResource[]> {
    if (apiResourceNames && apiScopeNames) {
      throw new Error(
        'Specifying both apiResourceNames and apiScopeNames is not supported.',
      )
    }

    if (apiResourceNames) {
      return await this.resourcesService.findApiResourcesByNameAsync(
        apiResourceNames,
      )
    } else {
      return await this.resourcesService.findApiResourcesByScopeNameAsync(
        apiScopeNames,
      )
    }
  }
}
