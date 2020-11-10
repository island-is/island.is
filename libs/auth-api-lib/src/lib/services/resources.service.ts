import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Op, WhereOptions } from 'sequelize'
import { IdentityResource } from '../entities/models/identity-resource.model'
import { ApiScope } from '../entities/models/api-scope.model'
import { ApiResource } from '../entities/models/api-resource.model'
import { ApiResourceScope } from '../entities/models/api-resource-scope.model'
import { IdentityResourceUserClaim } from '../entities/models/identity-resource-user-claim.model'
import { ApiResourceSecret } from '../entities/models/api-resource-secret.model'
import { ApiResourceUserClaim } from '../entities/models/api-resource-user-claim.model'
import { ApiScopeUserClaim } from '../entities/models/api-scope-user-claim.model'
import { IdentityResourcesDTO } from '../entities/dto/identity-resources-dto'
import { ApiScopesDTO } from '../entities/dto/api-scopes-dto'

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

    return this.identityResourceModel.findByPk(name)
  }

  /** Gets API scope by name */
  async getApiScopeByName(name: string): Promise<ApiScope | null> {
    this.logger.debug('Getting data about api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return this.apiScopeModel.findByPk(name)
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

  /** Deletes an identity resource by name */
  async deleteIdentityResource(name: string): Promise<number> {
    this.logger.debug('Removing identity resource with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.identityResourceModel.destroy({ where: { name: name } })
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

  /** Deletes an API scope */
  async deleteApiScope(name: string): Promise<number> {
    this.logger.debug('Deleting api scope with name: ', name)

    if (!name) {
      throw new BadRequestException('Name must be provided')
    }

    return await this.apiScopeModel.destroy({ where: { name: name } })
  }
}
