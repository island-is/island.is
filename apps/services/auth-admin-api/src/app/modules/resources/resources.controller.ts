import {
  ApiResource,
  ApiScope,
  ApiScopeUserClaim,
  ApiScopesDTO,
  IdentityResource,
  IdentityResourcesDTO,
  ResourcesService,
  IdentityResourceUserClaim,
  ApiResourcesDTO,
  ApiResourceSecretDTO,
  ApiResourceSecret,
  ApiResourceScope,
  ApiResourceAllowedScopeDTO,
  ApiResourceUserClaim,
  UserClaimDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('resources')
@Controller('backend')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /** Gets all Identity Resources and count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get('identity-resources')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(IdentityResource) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAllIdentityResources(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: IdentityResource[]; count: number }> {
    const identityResources = await this.resourcesService.findAndCountAllIdentityResources(
      page,
      count,
    )
    return identityResources
  }

  /** Gets all Api Scopes and count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scopes')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(ApiScope) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAllApiScopes(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: ApiScope[]; count: number }> {
    const apiScopes = await this.resourcesService.findAndCountAllApiScopes(
      page,
      count,
    )
    return apiScopes
  }

  /** Get's all Api resources and total count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get('api-resources')
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(ApiResource) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAllApiResources(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: ApiResource[]; count: number }> {
    if (searchString) {
      const apiResources = await this.resourcesService.findApiResources(
        searchString,
        page,
        count,
      )
      return apiResources
    }

    const apiResources = await this.resourcesService.findAndCountAllApiResources(
      page,
      count,
    )
    return apiResources
  }

  /** Gets Identity Resources by Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('identity-resources/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  async findIdentityResourcesByScopeName(
    @Query('scopeNames') scopeNames: string,
  ): Promise<IdentityResource[]> {
    const identityResources = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return identityResources
  }

  /** Gets Api Scopes by Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scopes/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  async findApiScopesByNameAsync(
    @Query('scopeNames') scopeNames: string,
  ): Promise<ApiScope[]> {
    const apiScopes = await this.resourcesService.findApiScopesByNameAsync(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return apiScopes
  }

  /** Gets Api Resources by either Api Resource Names or Api Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('api-resources/names')
  @ApiQuery({ name: 'apiResourceNames', required: false })
  @ApiQuery({ name: 'apiScopeNames', required: false })
  @ApiOkResponse({ type: ApiResource, isArray: true })
  async findApiResourcesByNameAsync(
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

  @Scopes(Scope.root, Scope.full)
  @Get('identity-resource/:id')
  async getIdentityResourceByName(
    @Param('id') name: string,
  ): Promise<IdentityResource> {
    return await this.resourcesService.getIdentityResourceByName(name)
  }

  /** Creates a new Identity Resource */
  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource')
  @ApiCreatedResponse({ type: IdentityResource })
  async createIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    return await this.resourcesService.createIdentityResource(identityResource)
  }

  /** Updates an existing Identity Resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Put('identity-resource/:name')
  @ApiOkResponse({ type: IdentityResource })
  async updateIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
    @Param('name') name: string,
  ): Promise<IdentityResource> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.updateIdentityResource(
      identityResource,
      name,
    )
  }

  /** Deletes an existing Identity Resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('identity-resource/:name')
  async deleteIdentityResource(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteIdentityResource(name)
  }

  /** Gets all Identity Resource User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('identity-resource-user-claim')
  @ApiOkResponse({ type: [IdentityResourceUserClaim] })
  async findAllIdentityResourceUserClaims(): Promise<
    IdentityResourceUserClaim[] | undefined
  > {
    return await this.resourcesService.findAllIdentityResourceUserClaims()
  }

  /** Creates a new Identity Resource User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource-user-claim')
  @ApiCreatedResponse({ type: IdentityResourceUserClaim })
  async createIdentityResourceUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<IdentityResourceUserClaim | undefined> {
    return await this.resourcesService.createIdentityResourceUserClaim(claim)
  }

  /** Gets all Api Scope User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scope-user-claim')
  @ApiOkResponse({ type: [ApiScopeUserClaim] })
  async findAllApiScopeUserClaims(): Promise<ApiScopeUserClaim[] | undefined> {
    return await this.resourcesService.findAllApiScopeUserClaims()
  }

  /** Creates a new Api Resource User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-user-claim')
  @ApiCreatedResponse({ type: ApiResourceUserClaim })
  async createApiResourceUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim | undefined> {
    return await this.resourcesService.createApiResourceUserClaim(claim)
  }

  /** Gets all Api Resource User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('api-resource-user-claim')
  @ApiOkResponse({ type: [ApiResourceUserClaim] })
  async findAllApiResourceUserClaims(): Promise<
    ApiResourceUserClaim[] | undefined
  > {
    return await this.resourcesService.findAllApiResourceUserClaims()
  }

  /** Creates a new Api Scope User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('api-scope-user-claim')
  @ApiCreatedResponse({ type: ApiScopeUserClaim })
  async createApiScopeUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<ApiScopeUserClaim | undefined> {
    return await this.resourcesService.createApiScopeUserClaim(claim)
  }

  /** Creates a new Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  async createApiScope(@Body() apiScope: ApiScopesDTO): Promise<ApiScope> {
    return await this.resourcesService.createApiScope(apiScope)
  }

  /** Creates a new Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource')
  @ApiCreatedResponse({ type: ApiResource })
  async createApiResource(
    @Body() apiResource: ApiResourcesDTO,
  ): Promise<ApiResource> {
    return await this.resourcesService.createApiResource(apiResource)
  }

  /** Updates an existing Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Put('api-scope/:name')
  @ApiOkResponse({ type: ApiScope })
  async updateApiScope(
    @Body() apiScope: ApiScopesDTO,
    @Param('name') name: string,
  ): Promise<ApiScope> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.updateApiScope(apiScope, name)
  }

  /** Updates an existing Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Put('api-resource/:name')
  @ApiOkResponse({ type: ApiResource })
  async updateApiResource(
    @Body() apiResource: ApiResourcesDTO,
    @Param('name') name: string,
  ): Promise<ApiResource> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.updateApiResource(apiResource, name)
  }

  /** Deletes an existing Api Scope by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope/:name')
  @ApiOkResponse()
  async deleteApiScope(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteApiScope(name)
  }

  /** Performs a soft delete on an Api resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-resource/:name')
  @ApiOkResponse()
  async deleteApiResource(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteApiResource(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource-user-claims/:identityResourceName/:claimName')
  async addResourceUserClaim(
    @Param('identityResourceName') identityResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<IdentityResourceUserClaim | null> {
    return await this.resourcesService.addResourceUserClaim(
      identityResourceName,
      claimName,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Delete('identity-resource-user-claims/:identityResourceName/:claimName')
  async removeResourceUserClaim(
    @Param('identityResourceName') identityResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<number> {
    return await this.resourcesService.removeResourceUserClaim(
      identityResourceName,
      claimName,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Post('api-scope-user-claims/:apiScopeName/:claimName')
  @ApiCreatedResponse({ type: ApiScopeUserClaim })
  async addApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
  ): Promise<ApiScopeUserClaim | null> {
    return await this.resourcesService.addApiScopeUserClaim(
      apiScopeName,
      claimName,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope-user-claims/:apiScopeName/:claimName')
  async removeApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
  ): Promise<number> {
    return await this.resourcesService.removeApiScopeUserClaim(
      apiScopeName,
      claimName,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Get('api-scope/:name')
  async getApiScopeByName(
    @Param('name') name: string,
  ): Promise<ApiScope | null> {
    return await this.resourcesService.getApiScopeByName(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Get('is-scope-name-available/:name')
  async isScopeNameAvailable(@Param('name') name: string): Promise<boolean> {
    return await this.resourcesService.isScopeNameAvailable(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Get('api-resource/:name')
  async getApiResourceByName(
    @Param('name') name: string,
  ): Promise<ApiResource | null> {
    return await this.resourcesService.getApiResourceByName(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-claims/:apiResourceName/:claimName')
  async addApiResourceUserClaim(
    @Param('apiResourceName') apiResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<ApiResourceUserClaim> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiResourceName must be provided')
    }

    return await this.resourcesService.addApiResourceUserClaim(
      apiResourceName,
      claimName,
    )
  }

  /** Removes user claim from Api Resource */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-resource-claims/:apiResourceName/:claimName')
  async removeApiResourceUserClaim(
    @Param('apiResourceName') apiResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<number> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiResourceName must be provided')
    }

    return await this.resourcesService.removeApiResourceUserClaim(
      apiResourceName,
      claimName,
    )
  }

  /** Add secret to ApiResource */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-secret')
  @ApiCreatedResponse({ type: ApiResourceSecret })
  async addApiResourceSecret(
    @Body() apiSecret: ApiResourceSecretDTO,
  ): Promise<ApiResourceSecret> {
    if (!apiSecret) {
      throw new BadRequestException('The apiSecret object must be provided')
    }

    return this.resourcesService.addApiResourceSecret(apiSecret)
  }

  /** Remove a secret from Api Resource */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-resource-secret')
  async removeApiResourceSecret(
    @Body() apiSecret: ApiResourceSecretDTO,
  ): Promise<number | null> {
    if (!apiSecret) {
      throw new BadRequestException(
        'apiSecret object must be provided when deleting',
      )
    }

    return this.resourcesService.removeApiResourceSecret(apiSecret)
  }

  /** Adds an allowed scope to api resource */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resources-allowed-scope')
  @ApiCreatedResponse({ type: ApiResourceScope })
  async addApiResourceAllowedScope(
    @Body() resourceAllowedScope: ApiResourceAllowedScopeDTO,
  ): Promise<ApiResourceScope | null> {
    if (!resourceAllowedScope) {
      throw new BadRequestException(
        'resourceAllowedScope object must be provided',
      )
    }

    return this.resourcesService.addApiResourceAllowedScope(
      resourceAllowedScope,
    )
  }

  /** Removes an allowed scope from api Resource */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-resources-allowed-scope/:apiResourceName/:scopeName')
  async removeApiResourceAllowedScope(
    @Param('apiResourceName') apiResourceName: string,
    @Param('scopeName') scopeName: string,
  ): Promise<number | null> {
    if (!apiResourceName || !scopeName) {
      throw new BadRequestException(
        'scopeName and apiResourceName must be provided',
      )
    }

    return await this.resourcesService.removeApiResourceAllowedScope(
      apiResourceName,
      scopeName,
    )
  }
}
