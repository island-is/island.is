import {
  ApiResource,
  ApiScope,
  IdentityResource,
  ResourcesService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
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
  async findIdentityResourcesByScopeName(
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
  async findApiScopesByNameAsync(
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
  async findApiResourcesByNameAsync(
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
      throw new BadRequestException(
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

  /** Gets the api scope names that are available to actors */
  @Scopes('@identityserver.api/authentication')
  @Get('api-scopes/for-actor')
  @ApiQuery({
    name: 'requestedScopes',
    type: String,
    required: true,
    allowEmptyValue: true,
  })
  @ApiOkResponse({ type: String, isArray: true })
  async findActorApiScopes(
    @Query(
      'requestedScopes',
      new ParseArrayPipe({ optional: false, items: String, separator: ',' }),
    )
    requestedScopes: string[],
  ): Promise<string[]> {
    return await this.resourcesService.findActorApiScopes(requestedScopes)
  }
}
