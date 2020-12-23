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
  ApiResourceScopeDTO,
  ApiResourceUserClaim,
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
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// TODO: Add guards when functional
// @UseGuards(AuthGuard('jwt'))
@ApiTags('resources')
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /** Gets all Identity Resources and count of rows */
  @Get('identity-resources')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  // TODO: Figure this out: @ApiOkResponse({  type: { rows: IdentityResource[]; count: number }, isArray: true })
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
  @Get('api-scopes')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  // TODO: Figure this out: @ApiOkResponse({  type: { rows: ApiScope[]; count: number }, isArray: true })
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
  @Get('api-resources')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  // TODO: Figure this out: @ApiOkResponse({  type: { rows: ApiResource[]; count: number }, isArray: true })
  async findAndCountAllApiResources(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: ApiResource[]; count: number }> {
    const apiResources = await this.resourcesService.findAndCountAllApiResources(
      page,
      count,
    )
    return apiResources
  }

  /** Gets Identity Resources by Scope Names */
  @Get('identity-resources/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  async FindIdentityResourcesByScopeName(
    @Query('scopeNames') scopeNames: string,
  ): Promise<IdentityResource[]> {
    const identityResources = await this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return identityResources
  }

  /** Gets Api Scopes by Scope Names */
  @Get('api-scopes/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  async FindApiScopesByNameAsync(
    @Query('scopeNames') scopeNames: string,
  ): Promise<ApiScope[]> {
    const apiScopes = await this.resourcesService.findApiScopesByNameAsync(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7

    return apiScopes
  }

  /** Gets Api Resources by either Api Resource Names or Api Scope Names */
  @Get('api-resources/names')
  @ApiQuery({ name: 'apiResourceNames', required: false })
  @ApiQuery({ name: 'apiScopeNames', required: false })
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

  @Get('identity-resource/:id')
  async GetIdentityResourceByName(
    @Param('id') name: string,
  ): Promise<IdentityResource> {
    return await this.resourcesService.getIdentityResourceByName(name)
  }

  /** Creates a new Identity Resource */
  @Post('identity-resource')
  @ApiCreatedResponse({ type: IdentityResource })
  async createIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    return await this.resourcesService.createIdentityResource(identityResource)
  }

  /** Updates an existing Identity Resource by it's name */
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
  @Delete('identity-resource/:name')
  @ApiOkResponse()
  async deleteIdentityResource(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteIdentityResource(name)
  }

  /** Creates a new Api Scope */
  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  async createApiScope(@Body() apiScope: ApiScopesDTO): Promise<ApiScope> {
    return await this.resourcesService.createApiScope(apiScope)
  }

  /** Creates a new Api Scope */
  @Post('api-resource')
  @ApiCreatedResponse({ type: ApiResource })
  async createApiResource(
    @Body() apiResource: ApiResourcesDTO,
  ): Promise<ApiResource> {
    return await this.resourcesService.createApiResource(apiResource)
  }

  /** Updates an existing Api Scope */
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
  @Delete('api-scope/:name')
  @ApiOkResponse()
  async deleteApiScope(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteApiScope(name)
  }

  /** Deletes an existing Api resource by it's name */
  @Delete('api-resource/:name')
  @ApiOkResponse()
  async deleteApiResource(@Param('name') name: string): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.deleteApiResource(name)
  }

  @Get('user-claims/:name')
  async getResourceUserClaims(@Param('name') name: string): Promise<any> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.resourcesService.getResourceUserClaims(name)
  }

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

  @Post('api-scope-user-claims/:apiScopeName/:claimName')
  async addApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
  ): Promise<ApiScopeUserClaim | null> {
    return await this.resourcesService.addApiScopeUserClaim(
      apiScopeName,
      claimName,
    )
  }

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

  @Get('api-scope/:name')
  async getApiScopeByName(
    @Param('name') name: string,
  ): Promise<ApiScope | null> {
    return await this.resourcesService.getApiScopeByName(name)
  }

  @Get('api-resource/:name')
  async getApiResourceByName(
    @Param('name') name: string,
  ): Promise<ApiResource | null> {
    return await this.resourcesService.getApiResourceByName(name)
  }

  @Post('api-resource-claims/:apiResourceName/:claimName')
  async addApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
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
  @Delete('api-resource-claims/:apiResourceName/:claimName')
  async removeApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
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
  @Post('api-resource-secret')
  async addApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<ApiResourceSecret> {
    if (!apiSecret) {
      throw new BadRequestException('apiSecret object must be provided')
    }

    return this.resourcesService.addApiResourceSecret(apiSecret)
  }

  /** Remove a secret from Api Resource */
  @Post('api-resource-secret')
  async removeApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<number | null> {
    if (!apiSecret) {
      throw new BadRequestException('apiSecret object must be provided')
    }

    return this.resourcesService.removeApiResourceSecret(apiSecret)
  }

  /** Adds an allowed scope to api resource */
  @Post('api-resources-allowed-scope')
  @ApiCreatedResponse({ type: ApiResourceScope })
  async addApiResourceAllowedScope(
    resourceAllowedScope: ApiResourceScopeDTO,
  ): Promise<ApiResourceScope | null> {
    if (!resourceAllowedScope) {
      throw new BadRequestException(
        'resourceAllowedScope object must be provided',
      )
    }

    return await this.resourcesService.addApiResourceAllowedScope(
      resourceAllowedScope,
    )
  }

  /** Removes an allowed scope from api Resource */
  @Delete('api-resources-allowed-scope/:apiResourceName/:scopeName')
  async removeApiResourceAllowedScope(
    apiResourceName: string,
    scopeName: string,
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
