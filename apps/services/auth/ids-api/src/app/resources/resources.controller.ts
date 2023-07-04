import {
  BadRequestException,
  Controller,
  Get,
  ParseArrayPipe,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import {
  ApiResource,
  ApiScope,
  ResourcesService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { IdentityResourceDTO } from './identity-resource.dto'
import { IdentityResourceMapper } from './identity-resource.mapper'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('resources')
@Controller({
  version: ['1', VERSION_NEUTRAL],
})
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
  @ApiOkResponse({ type: IdentityResourceDTO, isArray: true })
  async findIdentityResourcesByScopeName(
    @Query(
      'scopeNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    scopeNames: string[],
  ): Promise<IdentityResourceDTO[]> {
    const result = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames,
    )

    return result.map((r) => IdentityResourceMapper.toIdentityResourceDTO(r))
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
  findApiScopesByNameAsync(
    @Query(
      'scopeNames',
      new ParseArrayPipe({ optional: true, items: String, separator: ',' }),
    )
    scopeNames: string[],
  ): Promise<ApiScope[]> {
    return this.resourcesService.findApiScopesByNameAsync(scopeNames)
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
  findApiResourcesByNameAsync(
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
      return this.resourcesService.findApiResourcesByNameAsync(apiResourceNames)
    } else {
      return this.resourcesService.findApiResourcesByScopeNameAsync(
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
  findActorApiScopes(
    @Query(
      'requestedScopes',
      new ParseArrayPipe({ optional: false, items: String, separator: ',' }),
    )
    requestedScopes: string[],
  ): Promise<string[]> {
    return this.resourcesService.findActorApiScopes(requestedScopes)
  }
}
