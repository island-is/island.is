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

  /** Gets Identity resource by id */
  async getIdentityResourceById(id: string): Promise<IdentityResource> {
    this.logger.debug('Getting data about identity resource with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.identityResourceModel.findOne({
      where: { id: id },
    })
  }

  /** Gets API scope by id */
  async getApiScopeById(id: string): Promise<ApiScope> {
    this.logger.debug('Getting data about api scope with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.apiScopeModel.findOne({
      where: { id: id },
    })
  }

  /** Get identity resources by scope names */
  async findIdentityResourcesByScopeName(
    scopeNames: string[],
  ): Promise<IdentityResource[]> {
    this.logger.debug(`Finding identity resources for scope names`, scopeNames)

    if (!scopeNames) {
      throw new BadRequestException('ScopeNames must be provided')
    }

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: scopeNames,
      },
    }

    return this.identityResourceModel.findAll({
      where: scopeNames ? whereOptions : null,
      include: [IdentityResourceUserClaim],
    })
  }

  /** Gets Api scopes by scope names  */
  async findApiScopesByNameAsync(scopeNames: string[]): Promise<ApiScope[]> {
    this.logger.debug(`Finding api scopes for scope names`, scopeNames)

    if (!scopeNames) {
      throw new BadRequestException('ScopeNames must be provided')
    }

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: scopeNames,
      },
    }

    return this.apiScopeModel.findAll({
      where: scopeNames ? whereOptions : null,
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

    if (!apiResourceNames) {
      throw new BadRequestException('ApiResourceNames must be provided')
    }

    const whereOptions: WhereOptions = {
      name: {
        [Op.in]: apiResourceNames,
      },
    }

    return this.apiResourceModel.findAll({
      where: apiResourceNames ? whereOptions : null,
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

    if (!apiResourceScopeNames) {
      throw new BadRequestException('ApiResourceNames must be provided')
    }

    const scopesWhereOptions: WhereOptions = {
      scopeName: {
        [Op.in]: apiResourceScopeNames,
      },
    }
    const scopes = await this.apiResourceScopeModel.findAll({
      raw: true,
      where: apiResourceScopeNames ? scopesWhereOptions : null,
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
    id: string,
  ): Promise<IdentityResource> {
    this.logger.debug('Updating identity resource with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    await this.identityResourceModel.update(
      { ...identityResource },
      { where: { id: id } },
    )

    return await this.getIdentityResourceById(id)
  }

  /** Deletes an identity resource by id */
  async deleteIdentityResource(id: string): Promise<number> {
    this.logger.debug('Removing identity resource with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.identityResourceModel.destroy({ where: { id: id } })
  }

  /** Creates a new Api Scope */
  async createApiScope(apiScope: ApiScopesDTO): Promise<ApiScope> {
    this.logger.debug('Creating a new api scope')

    return await this.apiScopeModel.create({ ...apiScope })
  }

  /** Updates an existing API scope */
  async updateApiScope(apiScope: ApiScopesDTO, id: string): Promise<ApiScope> {
    this.logger.debug('Updating api scope with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    await this.apiScopeModel.update({ ...apiScope }, { where: { id: id } })

    return this.getApiScopeById(id)
  }

  /** Deletes an API scope */
  async deleteApiScope(id: string): Promise<number> {
    this.logger.debug('Deleting api scope with id: ', id)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return await this.apiScopeModel.destroy({ where: { id: id } })
  }
}
