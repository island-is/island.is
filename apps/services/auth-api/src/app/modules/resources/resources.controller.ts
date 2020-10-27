import { ApiResource } from './../../../../../../../libs/auth-api-lib/src/lib/entities/models/api-resource.model';
import { ApiScope } from './../../../../../../../libs/auth-api-lib/src/lib/entities/models/api-scope.model';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseArrayPipe,
  BadRequestException,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger'
import {
  IdentityResource,
  ResourcesService,
  Scopes,
} from '@island.is/auth-api-lib'

// TODO: Add guards after getting communications to work properly with IDS4
// @UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('resources')
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}
  
  /** Get Identity resources by scope names */
  @Scopes('@identityserver.api/authentication')
  @Get('identity-resources')
  @ApiQuery({
    name: 'scopeNames',
    type: String,
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  async FindIdentityResourcesByScopeName(
    @Query('scopeNames') scopeNames: string,
  ): Promise<IdentityResource[]> {
    const identityResources = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return identityResources
  }

  /** Gets API scopes by scope names */
  @Scopes('@identityserver.api/authentication')
  @Get('api-scopes')
  @ApiQuery({
    name: 'scopeNames',
    type: String,
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  async FindApiScopesByNameAsync(
    @Query('scopeNames') scopeNames: string,
  ): Promise<ApiScope[]> {
    const apiScopes = await this.resourcesService.findApiScopesByNameAsync(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return apiScopes
  }

  /** Gets api resources by resources names or scope names */
  @Scopes('@identityserver.api/authentication')
  @Get('api-resources')
  @ApiQuery({
    name: 'apiResourceNames',
    type: String,
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'apiScopeNames',
    type: String,
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({ type: ApiResource, isArray: true })
  async FindApiResourcesByNameAsync(
    @Query('apiResourceNames') apiResourceNames: string,
    @Query('apiScopeNames') apiScopeNames: string,
  ): Promise<ApiResource[]> {
    if (apiResourceNames && apiScopeNames) {
      throw new Error(
        'Specifying both apiResourceNames and apiScopeNames is not supported.',
      )
    }

    if (apiResourceNames) {
      return await this.resourcesService.findApiResourcesByNameAsync(
        apiResourceNames.split(','),
      ) // TODO: Check if we can use ParseArrayPipe from v7
    } else {
      return await this.resourcesService.findApiResourcesByScopeNameAsync(
        apiScopeNames ? apiScopeNames.split(',') : null,
      ) // TODO: Check if we can use ParseArrayPipe from v7
    }
  }
}
