import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
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

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(ApiResource)
    private apiResourceModel: typeof ApiResource,
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
    @Inject(Sequelize)
    private sequelize: Sequelize,
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
      include: [ApiScopeUserClaim],
      distinct: true,
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
      identityResource.userClaims = await this.identityResourceUserClaimModel.findAll(
        {
          where: { identityResourceName: identityResource.name },
          raw: true,
        },
      )
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
    })

    if (apiScope) {
      apiScope.userClaims = await this.apiScopeUserClaimModel.findAll({
        where: { apiScopeName: apiScope.name },
        raw: true,
      })
    }

    return apiScope
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
      include: [ApiScopeUserClaim],
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

  async getResourceUserClaims(name: string): Promise<any> {
    this.logger.debug('Getting user claims with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    /* 
    TODO: Create a table with all the claim names and get that list instead of distinct I.claim_name 
    TODO: Find out how to return an interface instead of any. 
          'sequelize.query' seems to support it with sequelize.query<T> but having difficulties implementing it error free
    */
    const [results, metadata] = await this.sequelize.query(
      `select distinct I.claim_name, (
        SELECT CAST(
           CASE WHEN EXISTS(
             SELECT * FROM identity_resource_user_claim where identity_resource_name like '${name}' and claim_name = I.claim_name
            ) THEN True 
           ELSE False
           END 
        AS BOOLEAN)
      ) as exists, 'Lorem ipsum' as claim_description
      from identity_resource_user_claim I
      order by exists desc
      LIMIT 8`,
    )

    return results
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
}
