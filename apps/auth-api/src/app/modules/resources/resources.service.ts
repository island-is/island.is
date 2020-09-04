import { Inject, Injectable, Optional } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { IdentityResource } from './identity-resource.model'
import { Op, WhereOptions } from 'sequelize'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'
import { ApiScope } from './api-scope.model'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'
import { ApiResourceUserClaim } from './api-resource-user-claim.model'
import { ApiResource } from './api-resource.model'
import { ApiResourceScope } from './api-resource-scope.model'
import { ApiResourceSecret } from './api-resource-secret.model'

@Injectable()
export class ResourcesService {
  applicationsRegistered = new Counter({
    name: 'apps_registered21',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    private sequelize: Sequelize,
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

  async FindIdentityResourcesByScopeName(scopeNames: string[]): Promise<IdentityResource[]> {
    this.logger.debug(`Finding identity resources for scope names`, scopeNames)

    let whereOptions: WhereOptions = {
        name: {
        [Op.in]: scopeNames
      }
    }

    return this.identityResourceModel.findAll({
      where: scopeNames ? whereOptions : null,
      include: [IdentityResourceUserClaim]
    })
  }

  async FindApiScopesByNameAsync(scopeNames: string[]): Promise<ApiScope[]> {
    this.logger.debug(`Finding api scopes for scope names`, scopeNames)

    let whereOptions: WhereOptions = {
        name: {
        [Op.in]: scopeNames
      }
    }

    return this.apiScopeModel.findAll({
      where: scopeNames ? whereOptions : null,
      include: [ApiScopeUserClaim]
    })
  }

  async FindApiResourcesByNameAsync(apiResourceNames: string[]): Promise<ApiResource[]> {
    this.logger.debug(`Finding api resources for resource names`, apiResourceNames)

    let whereOptions: WhereOptions = {
        name: {
        [Op.in]: apiResourceNames
      }
    }

    return this.apiResourceModel.findAll({
      where: apiResourceNames ? whereOptions : null,
      include: [ApiResourceSecret, ApiResourceScope, ApiResourceUserClaim]
    })
  }

  async FindApiResourcesByScopeNameAsync(apiResourceScopeNames: string[]): Promise<ApiResource[]> {
    this.logger.debug(`Finding api resources for resource scope names`, apiResourceScopeNames)

    let scopesWhereOptions: WhereOptions = {
      scope_name: {
        [Op.in]: apiResourceScopeNames
      }
    }
    let scopes = await this.apiResourceScopeModel.findAll({
      raw: true,
      where: apiResourceScopeNames ? scopesWhereOptions : null,
    })

    let whereOptions: WhereOptions = {
      id: {
        [Op.in]: scopes.map(scope => scope.apiResourceId)
      }
    }
    return this.apiResourceModel.findAll({
      where: whereOptions,
      include: [ApiResourceSecret, ApiResourceScope, ApiResourceUserClaim]
    })
  }
}
