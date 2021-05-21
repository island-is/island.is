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
  ApiScopeGroup,
  ApiScopeGroupDTO,
  PagedRowsDto,
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
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/environment'

const namespace = `${environment.audit.defaultNamespace}/resources`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('resources')
@Controller('backend')
@Audit({ namespace })
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly auditService: AuditService,
  ) {}

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
  @Audit<PagedRowsDto<IdentityResource>>({
    resources: (result) => result.rows.map((resource) => resource.name),
  })
  async findAndCountAllIdentityResources(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<IdentityResource>> {
    return this.resourcesService.findAndCountAllIdentityResources(page, count)
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
  @Audit<PagedRowsDto<ApiScope>>({
    resources: (result) => result.rows.map((scope) => scope.name),
  })
  async findAndCountAllApiScopes(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<ApiScope>> {
    return this.resourcesService.findAndCountAllApiScopes(page, count)
  }

  /** Finds all access controlled scopes */
  @Scopes(Scope.root, Scope.full)
  @Get('access-controlled-scopes')
  @ApiOkResponse({ type: [ApiScope] })
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  async findAllAccessControlledApiScopes(): Promise<ApiScope[]> {
    return this.resourcesService.findAllAccessControlledApiScopes()
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
  @Audit<PagedRowsDto<ApiResource>>({
    resources: (result) => result.rows.map((resource) => resource.name),
  })
  async findAndCountAllApiResources(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<ApiResource>> {
    if (searchString) {
      return this.resourcesService.findApiResources(searchString, page, count)
    }

    return this.resourcesService.findAndCountAllApiResources(page, count)
  }

  /** Get's all Api resources and total count of rows */
  @Scopes(Scope.root, Scope.full)
  @Get('all-api-resources')
  @ApiOkResponse({ type: [ApiResource] })
  async findAllApiResources(): Promise<ApiResource[]> {
    const apiResources = await this.resourcesService.findAllApiResources()
    return apiResources
  }

  /** Gets Identity Resources by Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('identity-resources/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: IdentityResource, isArray: true })
  @Audit<IdentityResource[]>({
    resources: (resources) => resources.map((resource) => resource.name),
  })
  async findIdentityResourcesByScopeName(
    @Query('scopeNames') scopeNames: string,
  ): Promise<IdentityResource[]> {
    return this.resourcesService.findIdentityResourcesByScopeName(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  /** Gets Api Scopes by Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scopes/scopenames')
  @ApiQuery({ name: 'scopeNames', required: false })
  @ApiOkResponse({ type: ApiScope, isArray: true })
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  async findApiScopesByNameAsync(
    @Query('scopeNames') scopeNames: string,
  ): Promise<ApiScope[]> {
    return this.resourcesService.findApiScopesByNameAsync(
      scopeNames ? scopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  /** Gets Api Resources by either Api Resource Names or Api Scope Names */
  @Scopes(Scope.root, Scope.full)
  @Get('api-resources/names')
  @ApiQuery({ name: 'apiResourceNames', required: false })
  @ApiQuery({ name: 'apiScopeNames', required: false })
  @ApiOkResponse({ type: ApiResource, isArray: true })
  @Audit<ApiResource[]>({
    resources: (resources) => resources.map((resource) => resource.name),
  })
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
      return this.resourcesService.findApiResourcesByNameAsync(
        apiResourceNames.split(','),
      ) // TODO: Check if we can use ParseArrayPipe from v7
    }

    return this.resourcesService.findApiResourcesByScopeNameAsync(
      apiScopeNames ? apiScopeNames.split(',') : null,
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  @Scopes(Scope.root, Scope.full)
  @Get('identity-resource/:id')
  @Audit<IdentityResource>({
    resources: (resource) => resource?.name,
  })
  async getIdentityResourceByName(
    @Param('id') name: string,
  ): Promise<IdentityResource> {
    return this.resourcesService.getIdentityResourceByName(name)
  }

  /** Creates a new Identity Resource */
  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource')
  @ApiCreatedResponse({ type: IdentityResource })
  @Audit<IdentityResource>({
    resources: (resource) => resource.name,
  })
  async createIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    return this.resourcesService.createIdentityResource(identityResource)
  }

  /** Updates an existing Identity Resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Put('identity-resource/:name')
  @ApiOkResponse({ type: IdentityResource })
  async updateIdentityResource(
    @Body() identityResource: IdentityResourcesDTO,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<IdentityResource> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'updateIdentityResource',
        namespace,
        resources: name,
        meta: { fields: Object.keys(identityResource) },
      },
      this.resourcesService.updateIdentityResource(identityResource, name),
    )
  }

  /** Deletes an existing Identity Resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('identity-resource/:name')
  async deleteIdentityResource(
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteIdentityResource',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteIdentityResource(name),
    )
  }

  /** Gets all Identity Resource User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('identity-resource-user-claim')
  @ApiOkResponse({ type: [IdentityResourceUserClaim] })
  @Audit<IdentityResourceUserClaim[]>({
    resources: (resources) =>
      resources.map((resource) => resource.identityResourceName),
  })
  async findAllIdentityResourceUserClaims(): Promise<
    IdentityResourceUserClaim[]
  > {
    return this.resourcesService.findAllIdentityResourceUserClaims()
  }

  /** Creates a new Identity Resource User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource-user-claim')
  @ApiCreatedResponse({ type: IdentityResourceUserClaim })
  @Audit<IdentityResourceUserClaim>({
    resources: (claim) => claim.identityResourceName,
  })
  async createIdentityResourceUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<IdentityResourceUserClaim> {
    return this.resourcesService.createIdentityResourceUserClaim(claim)
  }

  /** Gets all Api Scope User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scope-user-claim')
  @ApiOkResponse({ type: [ApiScopeUserClaim] })
  @Audit<ApiScopeUserClaim[]>({
    resources: (claims) => claims.map((claim) => claim.apiScopeName),
  })
  async findAllApiScopeUserClaims(): Promise<ApiScopeUserClaim[]> {
    return this.resourcesService.findAllApiScopeUserClaims()
  }

  /** Creates a new Api Resource User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-user-claim')
  @ApiCreatedResponse({ type: ApiResourceUserClaim })
  @Audit<ApiResourceUserClaim>({
    resources: (claim) => claim.apiResourceName,
  })
  async createApiResourceUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim> {
    return this.resourcesService.createApiResourceUserClaim(claim)
  }

  /** Gets all Api Resource User Claims */
  @Scopes(Scope.root, Scope.full)
  @Get('api-resource-user-claim')
  @ApiOkResponse({ type: [ApiResourceUserClaim] })
  @Audit<ApiResourceUserClaim>({
    resources: (claim) => claim.apiResourceName,
  })
  async findAllApiResourceUserClaims(): Promise<ApiResourceUserClaim[]> {
    return this.resourcesService.findAllApiResourceUserClaims()
  }

  /** Creates a new Api Scope User Claim */
  @Scopes(Scope.root, Scope.full)
  @Post('api-scope-user-claim')
  @ApiCreatedResponse({ type: ApiScopeUserClaim })
  @Audit<ApiScopeUserClaim>({
    resources: (claim) => claim.apiScopeName,
  })
  async createApiScopeUserClaim(
    @Body() claim: UserClaimDTO,
  ): Promise<ApiScopeUserClaim> {
    return this.resourcesService.createApiScopeUserClaim(claim)
  }

  /** Creates a new Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  @Audit<ApiScope>({
    resources: (scope) => scope.name,
  })
  async createApiScope(@Body() apiScope: ApiScopesDTO): Promise<ApiScope> {
    return this.resourcesService.createApiScope(apiScope)
  }

  /** Creates a new Api Resource */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource')
  @ApiCreatedResponse({ type: ApiResource })
  @Audit<ApiResource>({
    resources: (resource) => resource.name,
  })
  async createApiResource(
    @Body() apiResource: ApiResourcesDTO,
  ): Promise<ApiResource> {
    return this.resourcesService.createApiResource(apiResource)
  }

  /** Updates an existing Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Put('api-scope/:name')
  @ApiOkResponse({ type: ApiScope })
  async updateApiScope(
    @Body() apiScope: ApiScopesDTO,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<ApiScope> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'updateApiScope',
        namespace,
        resources: name,
        meta: { fields: Object.keys(apiScope) },
      },
      this.resourcesService.updateApiScope(apiScope, name),
    )
  }

  /** Updates an existing Api Scope */
  @Scopes(Scope.root, Scope.full)
  @Put('api-resource/:name')
  @ApiOkResponse({ type: ApiResource })
  async updateApiResource(
    @Body() apiResource: ApiResourcesDTO,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<ApiResource> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'updateApiResource',
        namespace,
        resources: name,
        meta: { fields: Object.keys(apiResource) },
      },
      this.resourcesService.updateApiResource(apiResource, name),
    )
  }

  /** Deletes an existing Api Scope by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope/:name')
  @ApiOkResponse()
  async deleteApiScope(
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteApiScope',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteApiScope(name),
    )
  }

  /** Performs a soft delete on an Api resource by it's name */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-resource/:name')
  @ApiOkResponse()
  async deleteApiResource(
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteApiResource',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteApiResource(name),
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Post('identity-resource-user-claims/:identityResourceName/:claimName')
  @Audit<IdentityResourceUserClaim>({
    resources: (claim) => `${claim.identityResourceName}/${claim.claimName}`,
  })
  async addResourceUserClaim(
    @Param('identityResourceName') identityResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<IdentityResourceUserClaim> {
    return this.resourcesService.addResourceUserClaim(
      identityResourceName,
      claimName,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Delete('identity-resource-user-claims/:identityResourceName/:claimName')
  async removeResourceUserClaim(
    @Param('identityResourceName') identityResourceName: string,
    @Param('claimName') claimName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'removeResourceUserClaim',
        namespace,
        resources: `${identityResourceName}/${claimName}`,
      },
      this.resourcesService.removeResourceUserClaim(
        identityResourceName,
        claimName,
      ),
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Post('api-scope-user-claims/:apiScopeName/:claimName')
  @ApiCreatedResponse({ type: ApiScopeUserClaim })
  @Audit<ApiScopeUserClaim>({
    resources: (claim) => `${claim.apiScopeName}/${claim.claimName}`,
  })
  async addApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
  ): Promise<ApiScopeUserClaim> {
    return this.resourcesService.addApiScopeUserClaim(apiScopeName, claimName)
  }

  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope-user-claims/:apiScopeName/:claimName')
  async removeApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'removeApiScopeUserClaim',
        namespace,
        resources: `${apiScopeName}/${claimName}`,
      },
      this.resourcesService.removeApiScopeUserClaim(apiScopeName, claimName),
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Get('api-scope/:name')
  @Audit<ApiScope>({
    resources: (scope) => scope?.name,
  })
  async getApiScopeByName(@Param('name') name: string): Promise<ApiScope> {
    return this.resourcesService.getApiScopeByName(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Get('is-scope-name-available/:name')
  @Audit()
  async isScopeNameAvailable(@Param('name') name: string): Promise<boolean> {
    return this.resourcesService.isScopeNameAvailable(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Get('api-resource/:name')
  @Audit<ApiResource>({
    resources: (resource) => resource?.name,
  })
  async getApiResourceByName(
    @Param('name') name: string,
  ): Promise<ApiResource> {
    return this.resourcesService.getApiResourceByName(name)
  }

  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-claims/:apiResourceName/:claimName')
  @Audit<ApiResourceUserClaim>({
    resources: (claim) => `${claim.apiResourceName}/${claim.claimName}`,
  })
  async addApiResourceUserClaim(
    @Param('apiResourceName') apiResourceName: string,
    @Param('claimName') claimName: string,
  ): Promise<ApiResourceUserClaim> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiResourceName must be provided')
    }

    return this.resourcesService.addApiResourceUserClaim(
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
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiResourceName must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'removeApiResourceUserClaim',
        namespace,
        resources: `${apiResourceName}/${claimName}`,
      },
      this.resourcesService.removeApiResourceUserClaim(
        apiResourceName,
        claimName,
      ),
    )
  }

  /** Add secret to ApiResource */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resource-secret')
  @ApiCreatedResponse({ type: ApiResourceSecret })
  @Audit<ApiResourceSecret>({
    resources: (secret) => secret.apiResourceName,
  })
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
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!apiSecret) {
      throw new BadRequestException(
        'apiSecret object must be provided when deleting',
      )
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'removeApiResourceSecret',
        namespace,
        resources: apiSecret.apiResourceName,
      },
      this.resourcesService.removeApiResourceSecret(apiSecret),
    )
  }

  /** Adds an allowed scope to api resource */
  @Scopes(Scope.root, Scope.full)
  @Post('api-resources-allowed-scope')
  @ApiCreatedResponse({ type: ApiResourceScope })
  @Audit<ApiResourceScope>({
    resources: (scope) => scope.apiResourceName,
    meta: (scope) => ({ scopeName: scope.scopeName }),
  })
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
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!apiResourceName || !scopeName) {
      throw new BadRequestException(
        'scopeName and apiResourceName must be provided',
      )
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'removeApiResourceAllowedScope',
        namespace: `${environment.audit.defaultNamespace}/resources`,
        resources: `${apiResourceName}/${scopeName}`,
      },
      this.resourcesService.removeApiResourceAllowedScope(
        apiResourceName,
        scopeName,
      ),
    )
  }

  /** Get api Resource from Api Resource Scope by Scope Name */
  @Scopes(Scope.root, Scope.full)
  @Get('api-scope-resource/:scopeName')
  async findApiResourceScopeByScopeName(
    @Param('scopeName') scopeName: string,
  ): Promise<ApiResourceScope | null> {
    if (!scopeName) {
      throw new BadRequestException('scopeName must be provided')
    }

    return await this.resourcesService.findApiResourceScopeByScopeName(
      scopeName,
    )
  }

  /** Removes api scope from Api Resource Scope */
  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope-resource/:scopeName')
  async removeApiScopeFromApiResourceScope(
    @Param('scopeName') scopeName: string,
  ): Promise<number | null> {
    if (!scopeName) {
      throw new BadRequestException('scopeName must be provided')
    }

    return await this.resourcesService.removeApiScopeFromApiResourceScope(
      scopeName,
    )
  }

  // #region ApiScopeGroup
  @Scopes(Scope.root, Scope.full)
  @Get('api-scope-group')
  async findApiScopeGroups(
    @Query('searchString') searchString?: string,
    @Query('page') page?: number,
    @Query('count') count?: number,
  ): Promise<
    | ApiScopeGroup[]
    | {
        rows: ApiScopeGroup[]
        count: number
      }
    | null
  > {
    if (!page || !count) {
      return this.resourcesService.findAllApiScopeGroups()
    }
    return this.resourcesService.findAndCountAllApiScopeGroups(
      searchString,
      page,
      count,
    )
  }

  @Scopes(Scope.root, Scope.full)
  @Get('api-scope-group/:id')
  async findApiScopeGroup(
    @Param('id') id: string,
  ): Promise<ApiScopeGroup | null> {
    return this.resourcesService.findApiScopeGroupByPk(id)
  }

  @Scopes(Scope.root, Scope.full)
  @Post('api-scope-group')
  async createApiScopeGroup(
    @Body() group: ApiScopeGroupDTO,
  ): Promise<ApiScopeGroup | null> {
    return await this.resourcesService.createApiScopeGroup(group)
  }

  @Scopes(Scope.root, Scope.full)
  @Put('api-scope-group/:id')
  async updateApiScopeGroup(
    @Body() group: ApiScopeGroupDTO,
    @Param('id') id: string,
  ): Promise<[number, ApiScopeGroup[]] | null> {
    return await this.resourcesService.updateApiScopeGroup(group, id)
  }

  @Scopes(Scope.root, Scope.full)
  @Delete('api-scope-group/:id')
  async deleteApiScopeGroup(@Param('id') id: string): Promise<number | null> {
    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    return await this.resourcesService.deleteApiScopeGroup(id)
  }

  // #endregion ApiScopeGroup
}
