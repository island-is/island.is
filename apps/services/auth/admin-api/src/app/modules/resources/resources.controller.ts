import {
  ApiResource,
  ApiScope,
  ApiScopeUserClaim,
  ApiScopeDTO,
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
  Domain,
  DomainDTO,
} from '@island.is/auth-api-lib'
import { NoContentException } from '@island.is/nest/problem'
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
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'

const namespace = `${environment.audit.defaultNamespace}/resources`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all Identity Resources and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('identity-resources')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiQuery({ name: 'includeArchived', required: false })
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
    @Query('includeArchived') includeArchived = false,
  ): Promise<PagedRowsDto<IdentityResource>> {
    return this.resourcesService.findAndCountAllIdentityResources(
      page,
      count,
      includeArchived,
    )
  }

  /** Gets all Api Scopes and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scopes')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiQuery({ name: 'includeArchived', required: false })
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
    @Query('includeArchived') includeArchived = false,
  ): Promise<PagedRowsDto<ApiScope>> {
    return this.resourcesService.findAndCountAllApiScopes(
      page,
      count,
      includeArchived,
    )
  }

  /** Finds all access controlled scopes */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('access-controlled-scopes')
  @ApiOkResponse({ type: [ApiScope] })
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  async findAllAccessControlledApiScopes(): Promise<ApiScope[]> {
    return this.resourcesService.findAllAccessControlledApiScopes()
  }

  /** Get's all Api resources and total count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-resources')
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiQuery({ name: 'includeArchived', required: false })
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
    @Query('includeArchived') includeArchived = false,
  ): Promise<PagedRowsDto<ApiResource>> {
    if (searchString) {
      return this.resourcesService.findApiResources(
        searchString,
        page,
        count,
        includeArchived,
      )
    }

    return this.resourcesService.findAndCountAllApiResources(
      page,
      count,
      includeArchived,
    )
  }

  /** Get's all Api resources and total count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('all-api-resources')
  @ApiOkResponse({ type: [ApiResource] })
  @Audit<ApiResource[]>({
    resources: (resources) => resources.map((resource) => resource.name),
  })
  async findAllApiResources(): Promise<ApiResource[]> {
    return this.resourcesService.findAllApiResources()
  }

  /** Gets Identity Resources by Scope Names */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
      scopeNames ? scopeNames.split(',') : [],
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  /** Gets Api Scopes by Scope Names */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
      scopeNames ? scopeNames.split(',') : [],
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  /** Gets Api Resources by either Api Resource Names or Api Scope Names */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
      apiScopeNames ? apiScopeNames.split(',') : [],
    ) // TODO: Check if we can use ParseArrayPipe from v7
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('identity-resource/:id')
  @Audit<IdentityResource>({
    resources: (resource) => resource?.name,
  })
  async getIdentityResourceByName(
    @Param('id') name: string,
  ): Promise<IdentityResource> {
    const identityResource =
      await this.resourcesService.getIdentityResourceByName(name)
    if (!identityResource) {
      throw new NoContentException()
    }
    return identityResource
  }

  /** Creates a new Identity Resource */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'updateIdentityResource',
        namespace,
        resources: name,
        meta: { fields: Object.keys(identityResource) },
      },
      this.resourcesService.updateIdentityResource(identityResource, name),
    )
  }

  /** Deletes an existing Identity Resource by it's name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'deleteIdentityResource',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteIdentityResource(name),
    )
  }

  /** Gets all Identity Resource User Claims */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scope-user-claim')
  @ApiOkResponse({ type: [ApiScopeUserClaim] })
  @Audit<ApiScopeUserClaim[]>({
    resources: (claims) => claims.map((claim) => claim.apiScopeName),
  })
  async findAllApiScopeUserClaims(): Promise<ApiScopeUserClaim[]> {
    return this.resourcesService.findAllApiScopeUserClaims()
  }

  /** Creates a new Api Resource User Claim */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-resource-user-claim')
  @ApiOkResponse({ type: [ApiResourceUserClaim] })
  @Audit<ApiResourceUserClaim>({
    resources: (claim) => claim.apiResourceName,
  })
  async findAllApiResourceUserClaims(): Promise<ApiResourceUserClaim[]> {
    return this.resourcesService.findAllApiResourceUserClaims()
  }

  /** Creates a new Api Scope User Claim */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('api-scope')
  @ApiCreatedResponse({ type: ApiScope })
  @Audit<ApiScope>({
    resources: (scope) => scope.name,
  })
  async createApiScope(@Body() apiScope: ApiScopeDTO): Promise<ApiScope> {
    return this.resourcesService.createApiScope(apiScope)
  }

  /** Creates a new Api Resource */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put('api-scope/:name')
  @ApiOkResponse({ type: ApiScope })
  async updateApiScope(
    @Body() apiScope: ApiScopeDTO,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<ApiScope> {
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updateApiScope',
        namespace,
        resources: name,
        meta: { fields: Object.keys(apiScope) },
      },
      this.resourcesService.updateApiScope(apiScope, name),
    )
  }

  /** Updates an existing Api Scope */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'updateApiResource',
        namespace,
        resources: name,
        meta: { fields: Object.keys(apiResource) },
      },
      this.resourcesService.updateApiResource(apiResource, name),
    )
  }

  /** Deletes an existing Api Scope by it's name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'deleteApiScope',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteApiScope(name),
    )
  }

  /** Performs a soft delete on an Api resource by it's name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'deleteApiResource',
        namespace,
        resources: name,
      },
      this.resourcesService.deleteApiResource(name),
    )
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('identity-resource-user-claims/:identityResourceName/:claimName')
  async removeResourceUserClaim(
    @Param('identityResourceName') identityResourceName: string,
    @Param('claimName') claimName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        auth: user,
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

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('api-scope-user-claims/:apiScopeName/:claimName')
  async removeApiScopeUserClaim(
    @Param('apiScopeName') apiScopeName: string,
    @Param('claimName') claimName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'removeApiScopeUserClaim',
        namespace,
        resources: `${apiScopeName}/${claimName}`,
      },
      this.resourcesService.removeApiScopeUserClaim(apiScopeName, claimName),
    )
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scope/:name')
  @Audit<ApiScope>({
    resources: (scope) => scope?.name,
  })
  async getApiScopeByName(@Param('name') name: string): Promise<ApiScope> {
    const apiScope = await this.resourcesService.getApiScopeByName(name)
    if (!apiScope) {
      throw new NoContentException()
    }
    return apiScope
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('is-scope-name-available/:name')
  @Audit()
  async isScopeNameAvailable(@Param('name') name: string): Promise<boolean> {
    return this.resourcesService.isScopeNameAvailable(name)
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-resource/:name')
  @Audit<ApiResource>({
    resources: (resource) => resource?.name,
  })
  async getApiResourceByName(
    @Param('name') name: string,
  ): Promise<ApiResource> {
    const apiResource = await this.resourcesService.getApiResourceByName(name)
    if (!apiResource) {
      throw new NoContentException()
    }
    return apiResource
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'removeApiResourceSecret',
        namespace,
        resources: apiSecret.apiResourceName,
      },
      this.resourcesService.removeApiResourceSecret(apiSecret),
    )
  }

  /** Adds an allowed scope to api resource */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
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
        auth: user,
        action: 'removeApiResourceAllowedScope',
        namespace,
        resources: `${apiResourceName}/${scopeName}`,
      },
      this.resourcesService.removeApiResourceAllowedScope(
        apiResourceName,
        scopeName,
      ),
    )
  }

  /** Get api Resource from Api Resource Scope by Scope Name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scope-resource/:scopeName')
  @Audit<ApiResourceScope>({
    resources: (scope) => scope?.scopeName,
  })
  async findApiResourceScopeByScopeName(
    @Param('scopeName') scopeName: string,
  ): Promise<ApiResourceScope> {
    if (!scopeName) {
      throw new BadRequestException('scopeName must be provided')
    }

    const apiResourceScope =
      await this.resourcesService.findApiResourceScopeByScopeName(scopeName)
    if (!apiResourceScope) {
      throw new NoContentException()
    }
    return apiResourceScope
  }

  /** Removes api scope from Api Resource Scope */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('api-scope-resource/:scopeName')
  async removeApiScopeFromApiResourceScope(
    @Param('scopeName') scopeName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!scopeName) {
      throw new BadRequestException('scopeName must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'removeApiScopeFromApiResourceScope',
        namespace,
        resources: scopeName,
      },
      this.resourcesService.removeApiScopeFromApiResourceScope(scopeName),
    )
  }

  // #region ApiScopeGroup
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scope-group')
  @Audit<ApiScopeGroup[] | PagedRowsDto<ApiScopeGroup>>({
    resources: (result) => {
      const groups = Array.isArray(result) ? result : result.rows
      return groups.map((group) => group.id)
    },
  })
  async findApiScopeGroups(
    @Query('searchString') searchString?: string,
    @Query('page') page?: number,
    @Query('count') count?: number,
  ): Promise<ApiScopeGroup[] | PagedRowsDto<ApiScopeGroup>> {
    if (!page || !count) {
      return this.resourcesService.findAllApiScopeGroups()
    }
    return this.resourcesService.findAndCountAllApiScopeGroups(
      searchString,
      page,
      count,
    )
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('api-scope-group/:id')
  @Audit<ApiScopeGroup>({
    resources: (group) => group?.id,
  })
  async findApiScopeGroup(
    @Param('id') id: string,
  ): Promise<ApiScopeGroup | null> {
    return this.resourcesService.findApiScopeGroupByPk(id)
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('api-scope-group')
  @Audit<ApiScopeGroup>({
    resources: (group) => group.id,
  })
  async createApiScopeGroup(
    @Body() group: ApiScopeGroupDTO,
  ): Promise<ApiScopeGroup> {
    return this.resourcesService.createApiScopeGroup(group)
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put('api-scope-group/:id')
  async updateApiScopeGroup(
    @Body() group: ApiScopeGroupDTO,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<[number, ApiScopeGroup[]]> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateApiScopeGroup',
        resources: id,
        meta: { fields: Object.keys(group) },
      },
      this.resourcesService.updateApiScopeGroup(group, id),
    )
  }

  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('api-scope-group/:id')
  async deleteApiScopeGroup(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'deleteApiScopeGroup',
        resources: id,
      },
      this.resourcesService.deleteApiScopeGroup(id),
    )
  }

  // #endregion ApiScopeGroup

  // #region Domain

  /** Find all domains with or without paging */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('domain')
  @Audit<Domain[] | PagedRowsDto<Domain>>({
    resources: (result) => {
      const domains = Array.isArray(result) ? result : result.rows
      return domains.map((domain) => domain.name)
    },
  })
  async findAllDomains(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<Domain[] | PagedRowsDto<Domain>> {
    return this.resourcesService.findAllDomains(searchString, page, count)
  }

  /** Gets domain by name */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('domain/:name')
  @Audit<Domain>({
    resources: (domain) => domain?.name,
  })
  async findDomainsByPk(@Param('name') name: string): Promise<Domain | null> {
    return this.resourcesService.findDomainByPk(name)
  }

  /** Creates a new Domain */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('domain')
  @Audit<ApiScopeGroup>({
    resources: (domain) => domain.name,
  })
  async createDomain(@Body() domain: DomainDTO): Promise<Domain> {
    return this.resourcesService.createDomain(domain)
  }

  /** Updates an existing Domain */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put('domain/:name')
  async updateDomain(
    @CurrentUser() user: User,
    @Body() domain: DomainDTO,
    @Param('name') name: string,
  ): Promise<[number, Domain[]]> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateDomain',
        resources: name,
        meta: { fields: Object.keys(domain) },
      },
      this.resourcesService.updateDomain(domain, name),
    )
  }

  /** Delete Domain */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('domain/:name')
  async deleteDomain(
    @CurrentUser() user: User,
    @Param('name') name: string,
  ): Promise<number> {
    if (!name) {
      throw new BadRequestException('name must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'deleteDomain',
        resources: name,
      },
      this.resourcesService.deleteDomain(name),
    )
  }

  // #endregion Domain
}
