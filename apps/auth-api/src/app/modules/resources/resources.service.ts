import { Inject, Injectable, Optional } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { IdentityResource } from './identity-resource.model'
import { Op, QueryTypes, WhereOptions } from 'sequelize'
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
      raw: true,
      where: scopeNames ? whereOptions : null,
    }).then(resources => {
        return Promise.all(resources.map(async resource => {
            const [result, meta] = await this.sequelize.query('SELECT "claim_name" FROM "identity_resource_user_claim" WHERE identity_resource_id=$resourceId',
            {
                bind: { resourceId: resource.id},
                type: QueryTypes.RAW,
                model: IdentityResourceUserClaim
            });
            resource.userClaims = result.map(claim => claim.claim_name)
            return resource
        }))
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
      raw: true,
      where: scopeNames ? whereOptions : null,
    }).then(scopes => {
        return Promise.all(scopes.map(async scope => {
            const [result, meta] = await this.sequelize.query('SELECT "claim_name" FROM "api_scope_user_claim" WHERE api_scope_id=$scopeId',
            {
                bind: { scopeId: scope.id},
                type: QueryTypes.RAW,
                model: ApiScopeUserClaim
            });
            scope.userClaims = result.map(claim => claim.claim_name)
            return scope
        }))
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
      raw: true,
      where: apiResourceNames ? whereOptions : null,
      // include: [ApiResourceSecret]
    }).then(apiResources => {
        return Promise.all(apiResources.map(async apiResource => {
            const [claims, meta] = await this.sequelize.query('SELECT "claim_name" FROM "api_resource_user_claim" WHERE api_resource_id=$apiResourceId',
            {
                bind: { apiResourceId: apiResource.id},
                type: QueryTypes.RAW,
                model: ApiResourceUserClaim
            });
            apiResource.userClaims = claims.map(claim => claim.claim_name)
            const [scopes, meta2] = await this.sequelize.query('SELECT "scope_name" FROM "api_resource_scope" WHERE api_resource_id=$apiResourceId',
            {
                bind: { apiResourceId: apiResource.id},
                type: QueryTypes.RAW,
                model: ApiResourceUserClaim
            });
            apiResource.scopes = scopes.map(scope => scope.scope_name)
            return apiResource
        }))
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
      raw: true,
      where: whereOptions,
      // include: [ApiResourceSecret]
    }).then(apiResources => {
        return Promise.all(apiResources.map(async apiResource => {
            const [claims, meta] = await this.sequelize.query('SELECT "claim_name" FROM "api_resource_user_claim" WHERE api_resource_id=$apiResourceId',
            {
                bind: { apiResourceId: apiResource.id},
                type: QueryTypes.RAW,
                model: ApiResourceUserClaim
            });
            apiResource.userClaims = claims.map(claim => claim.claim_name)
            const [scopes, meta2] = await this.sequelize.query('SELECT "scope_name" FROM "api_resource_scope" WHERE api_resource_id=$apiResourceId',
            {
                bind: { apiResourceId: apiResource.id},
                type: QueryTypes.RAW,
                model: ApiResourceUserClaim
            });
            apiResource.scopes = scopes.map(scope => scope.scope_name)
            return apiResource
        }))
    })
  }
}
