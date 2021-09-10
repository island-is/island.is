/* eslint-disable  @typescript-eslint/no-explicit-any */
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Op, Sequelize, WhereOptions } from 'sequelize'
import { IdentityResource } from '../entities/models/identity-resource.model'
import { ApiScope } from '../entities/models/api-scope.model'
import { ApiResource } from '../entities/models/api-resource.model'
import { ApiResourceScope } from '../entities/models/api-resource-scope.model'
import { IdentityResourceUserClaim } from '../entities/models/identity-resource-user-claim.model'
import { ApiResourceSecret } from '../entities/models/api-resource-secret.model'
import { ApiResourceUserClaim } from '../entities/models/api-resource-user-claim.model'
import { ApiScopeUserClaim } from '../entities/models/api-scope-user-claim.model'
import { IdentityResourcesDTO } from '../entities/dto/identity-resources.dto'
import { ApiScopesDTO } from '../entities/dto/api-scopes.dto'
import { ApiResourcesDTO } from '../entities/dto/api-resources.dto'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import { ApiResourceSecretDTO } from '../entities/dto/api-resource-secret.dto'
import { ApiResourceAllowedScopeDTO } from '../entities/dto/api-resource-allowed-scope.dto'
import { UserClaimDTO } from '../entities/dto/user-claim.dto'
import { ApiScopeGroupDTO } from '../entities/dto/api-scope-group.dto'
import { ApiScopeGroup } from '../entities/models/api-scope-group.model'
import { uuid } from 'uuidv4'
import { Domain } from '../entities/models/domain.model'
import { PagedRowsDto } from '../entities/dto/paged-rows.dto'
import { DomainDTO } from '../entities/dto/domain.dto'

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(ApiResource)
    private apiResourceModel: typeof ApiResource,
    @InjectModel(ApiScopeGroup)
    private apiScopeGroup: typeof ApiScopeGroup,
    @InjectModel(ApiResourceScope)
    private apiResourceScopeModel: typeof ApiResourceScope,
    @InjectModel(IdentityResourceUserClaim)
    private identityResourceUserClaimModel: typeof IdentityResourceUserClaim,
    @InjectModel(ApiScopeUserClaim)
    private apiScopeUserClaimModel: typeof ApiScopeUserClaim,
    @InjectModel(ApiResourceUserClaim)
    private apiResourceUserClaim: typeof ApiResourceUserClaim,
    @InjectModel(ApiResourceSecret)
    private apiResourceSecret: typeof ApiResourceSecret,
    @InjectModel(ApiResourceScope)
    private apiResourceScope: typeof ApiResourceScope,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all identity resources and total count of rows */
  async findAndCountAllIdentityResources(
    page: number,
    count: number,
  ): Promise<{
    rows: IdentityResource[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.identityResourceModel.findAndCountAll({
      limit: count,
      offset: offset,
      include: [IdentityResourceUserClaim],
      distinct: true,
    })
  }

  /** Finds Api resources with searchString and returns with paging */
  async findApiResources(searchString: string, page: number, count: number) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }

    searchString = searchString.trim()

    if (isNaN(+searchString)) {
      return this.findApiResourcesByName(searchString, page, count)
    } else {
      return this.findApiResourcesByNationalId(searchString, page, count)
    }
  }

  /** Finds all Api resources without paging */
  async findAllApiResources(): Promise<ApiResource[] | null> {
    return this.apiResourceModel.findAll({ order: [['name', 'asc']] })
  }

  /** Finds Api resources with by national Id and returns with paging */
  async findApiResourcesByNationalId(
    searchString: string,
    page: number,
    count: number,
  ) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }
    page--
    const offset = page * count
    return this.apiResourceModel.findAndCountAll({
      where: { nationalId: searchString },
      limit: count,
      offset: offset,
      include: [ApiResourceUserClaim, ApiResourceScope, ApiResourceSecret],
      distinct: true,
    })
  }

  /** Finds Api resources with by name */
  async findApiResourcesByName(
    searchString: string,
    page: number,
    count: number,
  ) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }
    page--
    const offset = page * count
    return this.apiResourceModel.findAndCountAll({
      where: { name: searchString },
      limit: count,
      offset: offset,
      include: [ApiResourceUserClaim, ApiResourceScope, ApiResourceSecret],
      distinct: true,
    })
  }

  /** Get's all Api resources and total count of rows */
  async findAndCountAllApiResources(
    page: number,
    count: number,
  ): Promise<{
    rows: ApiResource[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.apiResourceModel.findAndCountAll({
      limit: count,
      offset: offset,
      include: [ApiResourceUserClaim, ApiResourceScope, ApiResourceSecret],
      distinct: true,
    })
  }

  /** Get's all Api scopes and total count of rows */
  async findAndCountAllApiScopes(
    page: number,
    count: number,
  ): Promise<{
    rows: ApiScope[]
    count: number
  } | null> {
    page--
    const offset = page * count
    return this.apiScopeModel.findAndCountAll({
      limit: count,
      offset: offset,
      include: [ApiScopeUserClaim, ApiScopeGroup],
      distinct: true,
    })
  }

  /** Get's all Api scopes that are access controlled */
  async findAllAccessControlledApiScopes(): Promise<ApiScope[]> {
    return this.apiScopeModel.findAll({
      where: {
        isAccessControlled: true,
        name: {
          [Op.not]: '@island.is/auth/admin:root',
        },
      },
      include: [ApiScopeGroup],
    })
  }

  /** Gets Identity resource by name */
  async getIdentityResourceByName(
    name: string,
  ): Promise<IdentityResource | null> {
    this.logger.debug('Getting data about identity resource with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const identityResource = await this.identityResourceModel.findByPk(name, {
      raw: true,
    })

    if (identityResource) {
      identityResource.userClaims =
        await this.identityResourceUserClaimModel.findAll({
          where: { identityResourceName: identityResource.name },
          raw: true,
        })
    }

    return identityResource
  }

  /** Gets API scope by name */
  async getApiScopeByName(name: string): Promise<ApiScope | null> {
    this.logger.debug('Getting data about api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const apiScope = await this.apiScopeModel.findByPk(name, {
      raw: true,
      include: [ApiScopeGroup],
    })

    if (apiScope) {
      apiScope.userClaims = await this.apiScopeUserClaimModel.findAll({
        where: { apiScopeName: apiScope.name },
        raw: true,
      })
    }

    return apiScope
  }

  /** Gets API scope or IdentityResource by name */
  async isScopeNameAvailable(name: string): Promise<boolean> {
    this.logger.debug(
      'Checking if api scope or identity resource is available with name: ',
      name,
    )

    if (!name) {
      return false
    }

    const apiScope = await this.apiScopeModel.findByPk(name)
    if (apiScope) {
      return false
    }

    const idr = await this.identityResourceModel.findByPk(name)
    if (idr) {
      return false
    }

    return true
  }

  /** Gets API scope by name */
  async getApiResourceByName(name: string): Promise<ApiResource | null> {
    this.logger.debug('Getting data about api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const apiResource = await this.apiResourceModel.findByPk(name, {
      raw: true,
    })

    if (apiResource) {
      await this.findApiResourceAssociations(apiResource)
        .then<any, never>((result: any) => {
          apiResource.userClaims = result[0]
          apiResource.scopes = result[1]
          apiResource.apiSecrets = result[2]
        })
        .catch((error) =>
          this.logger.error(`Error in findAssociations: ${error}`),
        )
    }

    return apiResource
  }

  private findApiResourceAssociations(apiResource: ApiResource): Promise<any> {
    return Promise.all([
      this.apiResourceUserClaim.findAll({
        where: { apiResourceName: apiResource.name },
        raw: true,
      }), // 0
      this.apiResourceScope.findAll({
        where: { apiResourceName: apiResource.name },
        raw: true,
      }), // 1
      this.apiResourceSecret.findAll({
        where: { apiResourceName: apiResource.name },
        raw: true,
      }), // 2
    ])
  }

  /** Get identity resources by scope names */
  async findIdentityResourcesByScopeName(
    scopeNames: string[],
  ): Promise<IdentityResource[]> {
    this.logger.debug(`Finding identity resources for scope names`, scopeNames)

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: scopeNames,
      },
    }

    return this.identityResourceModel.findAll({
      where: scopeNames ? whereOptions : undefined,
      include: [IdentityResourceUserClaim],
    })
  }

  /** Gets Api scopes by scope names  */
  async findApiScopesByNameAsync(scopeNames: string[]): Promise<ApiScope[]> {
    this.logger.debug(`Finding api scopes for scope names`, scopeNames)

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: scopeNames,
      },
    }

    return this.apiScopeModel.findAll({
      where: scopeNames ? whereOptions : undefined,
      include: [ApiScopeUserClaim, ApiScopeGroup],
    })
  }

  /** Gets Api scopes with Explicit Delegation Grant */
  async findApiScopesWithExplicitDelegationGrant(): Promise<ApiScope[]> {
    this.logger.debug(`Finding api scopes with Explicit Delegation Grant`)

    return this.apiScopeModel.findAll({
      where: { allowExplicitDelegationGrant: true },
      include: [ApiScopeGroup],
    })
  }

  /** Filters out scopes that don't have delegation grant and are access controlled */
  async findAllowedDelegationApiScopeListForUser(scopes: string[]) {
    this.logger.debug(`Finding allowed api scopes for scopes ${scopes}`)
    return this.apiScopeModel.findAll({
      where: {
        name: {
          [Op.in]: scopes,
        },
        allowExplicitDelegationGrant: true,
      },
      include: [ApiScopeGroup],
    })
  }

  /** Filters out Identity Resources that don't have delegation grant and are access controlled */
  async findAllowedDelegationIdentityResourceListForUser(
    identityResources: string[],
  ) {
    this.logger.debug(
      `Finding allowed Identity Resources for identity resources: ${identityResources}`,
    )
    return this.identityResourceModel.findAll({
      where: {
        name: {
          [Op.in]: identityResources,
        },
        allowExplicitDelegationGrant: true,
        alsoForDelegatedUser: false,
      },
    })
  }

  /** Gets Api scopes with Explicit Delegation Grant */
  async findIdentityResourcesWithExplicitDelegationGrant(): Promise<
    IdentityResource[]
  > {
    this.logger.debug(
      `Finding identity resources with Explicit Delegation Grant`,
    )

    return this.identityResourceModel.findAll({
      where: { allowExplicitDelegationGrant: true },
    })
  }

  /** Gets api resources by api resource names  */
  async findApiResourcesByNameAsync(
    apiResourceNames: string[],
  ): Promise<ApiResource[]> {
    this.logger.debug(
      `Finding api resources for resource names`,
      apiResourceNames,
    )

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: apiResourceNames,
      },
    }

    return this.apiResourceModel.findAll({
      where: apiResourceNames ? whereOptions : undefined,
      include: [ApiResourceSecret, ApiResourceScope, ApiResourceUserClaim],
    })
  }

  /** Get Api resources by scope names */
  async findApiResourcesByScopeNameAsync(
    apiResourceScopeNames: string[],
  ): Promise<ApiResource[]> {
    this.logger.debug(
      `Finding api resources for resource scope names`,
      apiResourceScopeNames,
    )

    const scopesWhereOptions: WhereOptions = {
      scopeName: {
        [Op.in]: apiResourceScopeNames,
      },
    }
    const scopes = await this.apiResourceScopeModel.findAll({
      raw: true,
      where: apiResourceScopeNames ? scopesWhereOptions : undefined,
    })

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: scopes.map((scope) => scope.apiResourceName),
      },
    }
    return this.apiResourceModel.findAll({
      where: whereOptions,
      include: [ApiResourceSecret, ApiResourceScope, ApiResourceUserClaim],
    })
  }

  /** Creates a new identity resource */
  async createIdentityResource(
    identityResource: IdentityResourcesDTO,
  ): Promise<IdentityResource> {
    this.logger.debug('Creating a new identity resource')
    return await this.identityResourceModel.create({ ...identityResource })
  }

  /** Updates an existing Identity resource */
  async updateIdentityResource(
    identityResource: IdentityResourcesDTO,
    name: string,
  ): Promise<IdentityResource | null> {
    this.logger.debug('Updating identity resource with name: ', name)
    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    await this.identityResourceModel.update(
      { ...identityResource },
      { where: { name: name } },
    )

    return await this.getIdentityResourceByName(name)
  }

  /** Soft delete on an identity resource by name */
  async deleteIdentityResource(name: string): Promise<number> {
    this.logger.debug('Soft deleting an identity resource with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const result = await this.identityResourceModel.update(
      { archived: new Date(), enabled: false },
      { where: { name: name } },
    )

    return result[0]
  }

  /** Creates a new Api Resource */
  async createApiResource(apiResource: ApiResourcesDTO): Promise<ApiResource> {
    this.logger.debug('Creating a new api resource')

    return await this.apiResourceModel.create({ ...apiResource })
  }

  /** Creates a new Api Scope */
  async createApiScope(apiScope: ApiScopesDTO): Promise<ApiScope> {
    this.logger.debug('Creating a new api scope')

    return await this.apiScopeModel.create({ ...apiScope })
  }

  /** Updates an existing API scope */
  async updateApiScope(
    apiScope: ApiScopesDTO,
    name: string,
  ): Promise<ApiScope | null> {
    this.logger.debug('Updating api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    await this.apiScopeModel.update({ ...apiScope }, { where: { name: name } })

    return this.getApiScopeByName(name)
  }

  /** Updates an existing API scope */
  async updateApiResource(
    apiResource: ApiResourcesDTO,
    name: string,
  ): Promise<ApiResource | null> {
    this.logger.debug('Updating api resource with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    await this.apiResourceModel.update(
      { ...apiResource },
      { where: { name: name } },
    )

    return this.getApiResourceByName(name)
  }

  /** Soft delete on an API scope */
  async deleteApiScope(name: string): Promise<number> {
    this.logger.debug('Soft deleting api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const result = await this.apiScopeModel.update(
      { archived: new Date(), enabled: false },
      { where: { name: name } },
    )

    return result[0]
  }

  /** Soft delete on an API resource */
  async deleteApiResource(name: string): Promise<number> {
    this.logger.debug('Soft deleting an api resource with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    const result = await this.apiResourceModel.update(
      { archived: new Date(), enabled: false },
      { where: { name: name } },
    )

    return result[0]
  }

  async addResourceUserClaim(
    identityResourceName: string,
    claimName: string,
  ): Promise<IdentityResourceUserClaim> {
    if (!identityResourceName || !claimName) {
      throw new BadRequestException('Name and resourceName must be provided')
    }

    return await this.identityResourceUserClaimModel.create({
      identityResourceName: identityResourceName,
      claimName: claimName,
    })
  }

  async removeResourceUserClaim(
    identityResourceName: string,
    claimName: string,
  ): Promise<number> {
    if (!identityResourceName || !claimName) {
      throw new BadRequestException('Name and resourceName must be provided')
    }

    return await this.identityResourceUserClaimModel.destroy({
      where: {
        identityResourceName: identityResourceName,
        claimName: claimName,
      },
    })
  }

  /** Adds user claim to Api Scope */
  async addApiScopeUserClaim(
    apiScopeName: string,
    claimName: string,
  ): Promise<ApiScopeUserClaim> {
    if (!apiScopeName || !claimName) {
      throw new BadRequestException('Name and apiScopeName must be provided')
    }

    return await this.apiScopeUserClaimModel.create({
      apiScopeName: apiScopeName,
      claimName: claimName,
    })
  }

  /** Removes user claim from Api Scope */
  async removeApiScopeUserClaim(
    apiScopeName: string,
    claimName: string,
  ): Promise<number> {
    if (!apiScopeName || !claimName) {
      throw new BadRequestException('Name and apiScopeName must be provided')
    }

    return await this.apiScopeUserClaimModel.destroy({
      where: {
        apiScopeName: apiScopeName,
        claimName: claimName,
      },
    })
  }

  /** Adds user claim to Api Resource */
  async addApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
  ): Promise<ApiResourceUserClaim> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiResourceName must be provided')
    }

    return await this.apiResourceUserClaim.create({
      apiResourceName: apiResourceName,
      claimName: claimName,
    })
  }

  /** Removes user claim from Api Resource */
  async removeApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
  ): Promise<number> {
    if (!apiResourceName || !claimName) {
      throw new BadRequestException('Name and apiScopeName must be provided')
    }

    return await this.apiResourceUserClaim.destroy({
      where: {
        apiResourceName: apiResourceName,
        claimName: claimName,
      },
    })
  }

  /** Add secret to ApiResource */
  async addApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<ApiResourceSecret> {
    const words = sha256(apiSecret.value)
    const secret = Base64.stringify(words)

    return this.apiResourceSecret.create({
      apiResourceName: apiSecret.apiResourceName,
      value: secret,
      description: apiSecret.description,
      type: apiSecret.type,
    })
  }

  /** Remove a secret from Api Resource */
  async removeApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<number> {
    return this.apiResourceSecret.destroy({
      where: {
        apiResourceName: apiSecret.apiResourceName,
        value: apiSecret.value,
      },
    })
  }

  /** Adds an allowed scope to api resource */
  async addApiResourceAllowedScope(
    resourceAllowedScope: ApiResourceAllowedScopeDTO,
  ): Promise<ApiResourceScope> {
    this.logger.debug(
      `Adding allowed scope - "${resourceAllowedScope.scopeName}" to api resource - "${resourceAllowedScope.apiResourceName}"`,
    )

    if (!resourceAllowedScope) {
      throw new BadRequestException(
        'resourceAllowedScope object must be provided',
      )
    }

    return await this.apiResourceScope.create({ ...resourceAllowedScope })
  }

  /** Removes an allowed scope from api Resource */
  async removeApiResourceAllowedScope(
    apiResourceName: string,
    scopeName: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing scope - "${scopeName}" from api resource - "${apiResourceName}"`,
    )

    if (!apiResourceName || !scopeName) {
      throw new BadRequestException(
        'scopeName and apiResourceName must be provided',
      )
    }

    return await this.apiResourceScope.destroy({
      where: { apiResourceName: apiResourceName, scopeName: scopeName },
    })
  }

  /** Removes connections from ApiResourceScope for an Api Scope */
  async removeApiScopeFromApiResourceScope(scopeName: string): Promise<number> {
    return await this.apiResourceScope.destroy({
      where: { scopeName: scopeName },
    })
  }

  /** Get the Api resource conntected to Api Scope */
  async findApiResourceScopeByScopeName(
    scopeName: string,
  ): Promise<ApiResourceScope | null> {
    return await this.apiResourceScope.findOne({
      where: { scopeName: scopeName },
    })
  }

  // User Claims

  /** Gets all Identity Resource User Claims */
  async findAllIdentityResourceUserClaims(): Promise<
    IdentityResourceUserClaim[]
  > {
    return this.identityResourceUserClaimModel.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('claim_name')), 'claimName'],
      ],
    })
  }

  /** Gets all Api Scope User Claims */
  async findAllApiScopeUserClaims(): Promise<ApiScopeUserClaim[]> {
    return this.apiScopeUserClaimModel.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('claim_name')), 'claimName'],
      ],
    })
  }

  /** Gets all Api Resource User Claims */
  async findAllApiResourceUserClaims(): Promise<ApiResourceUserClaim[]> {
    return this.apiResourceUserClaim.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('claim_name')), 'claimName'],
      ],
    })
  }

  /** Creates a new user claim for Api Resource */
  async createApiResourceUserClaim(
    claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim> {
    return this.apiResourceUserClaim.create({
      apiResourceName: claim.resourceName,
      claimName: claim.claimName,
    })
  }

  /** Creates a new user claim for Identity Resource */
  async createIdentityResourceUserClaim(
    claim: UserClaimDTO,
  ): Promise<IdentityResourceUserClaim> {
    return this.identityResourceUserClaimModel.create({
      identityResourceName: claim.resourceName,
      claimName: claim.claimName,
    })
  }

  /** Creates a new user claim for Api Scope */
  async createApiScopeUserClaim(
    claim: UserClaimDTO,
  ): Promise<ApiScopeUserClaim> {
    return this.apiScopeUserClaimModel.create({
      apiScopeName: claim.resourceName,
      claimName: claim.claimName,
    })
  }

  // #region ApiScopeGroup

  /** Creates a new Api Scope Group */
  async createApiScopeGroup(group: ApiScopeGroupDTO): Promise<ApiScopeGroup> {
    const id = uuid()
    return this.apiScopeGroup.create({ id: id, ...group })
  }

  /** Updates an existing ApiScopeGroup */
  async updateApiScopeGroup(
    group: ApiScopeGroupDTO,
    id: string,
  ): Promise<[number, ApiScopeGroup[]]> {
    return this.apiScopeGroup.update({ ...group }, { where: { id: id } })
  }

  /** Delete ApiScopeGroup */
  async deleteApiScopeGroup(id: string): Promise<number> {
    return this.apiScopeGroup.destroy({ where: { id: id } })
  }

  /** Returns all ApiScopeGroups */
  async findAllApiScopeGroups(): Promise<ApiScopeGroup[]> {
    return this.apiScopeGroup.findAll({
      order: [['name', 'asc']],
      include: [ApiScope],
    })
  }

  /** Returns all ApiScopeGroups by name if specified with Paging */
  async findAndCountAllApiScopeGroups(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: ApiScopeGroup[]
    count: number
  }> {
    page--
    const offset = page * count
    if (!searchString || searchString.length === 0) {
      searchString = '%'
    }
    return this.apiScopeGroup.findAndCountAll({
      limit: count,
      offset: offset,
      where: { name: { [Op.iLike]: `%${searchString}%` } },
      order: [['name', 'asc']],
      include: [ApiScope],
    })
  }

  /** Finds Api SCope Group by Id */
  async findApiScopeGroupByPk(id: string): Promise<ApiScopeGroup | null> {
    return this.apiScopeGroup.findByPk(id, { include: [ApiScope] })
  }
  // #endregion ApiScopeGroup

  async findActorApiScopes(requestedScopes: string[]): Promise<string[]> {
    const scopes: ApiScope[] = await this.apiScopeModel.findAll({
      where: {
        alsoForDelegatedUser: true,
        name: { [Op.in]: requestedScopes },
      },
      include: [ApiScopeGroup],
    })

    return scopes.map((s: ApiScope): string => s.name)
  }

  // #region Domain

  /** Find all domains with or without paging */
  async findAllDomains(
    searchString: string | null = null,
    page: number | null = null,
    count: number | null = null,
  ): Promise<Domain[] | PagedRowsDto<Domain>> {
    if (page && count) {
      if (page > 0 && count > 0) {
        page!--
        const offset = page! * count!
        if (!searchString || searchString.length === 0) {
          searchString = '%'
        }
        return this.domainModel.findAndCountAll({
          limit: count,
          offset: offset,
          where: { name: { [Op.iLike]: `%${searchString}%` } },
          order: [['name', 'asc']],
          include: [ApiScopeGroup],
        })
      }
    }
    return this.domainModel.findAll({ order: [['name', 'asc']] })
  }

  /** Gets domain by name */
  async findDomainByPk(name: string): Promise<Domain | null> {
    return this.domainModel.findByPk(name)
  }

  /** Creates a new Domain */
  async createDomain(domain: DomainDTO): Promise<Domain> {
    return this.domainModel.create({ ...domain })
  }

  /** Updates an existing Domain */
  async updateDomain(
    domain: DomainDTO,
    name: string,
  ): Promise<[number, Domain[]]> {
    return this.domainModel.update({ ...domain }, { where: { name: name } })
  }

  /** Delete Domain */
  async deleteDomain(name: string): Promise<number> {
    return this.domainModel.destroy({ where: { name: name } })
  }

  // #endregion Domain
}
