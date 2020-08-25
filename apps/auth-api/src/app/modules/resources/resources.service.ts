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
    this.logger.debug(`Finding identity resources for scope names`, scopeNames)

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
}
