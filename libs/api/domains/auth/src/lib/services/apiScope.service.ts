import { Injectable } from '@nestjs/common'
import { ApiScopeServiceV1 } from '../services-v1/apiScope.service'
import { ApiScopeServiceI } from './types'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { User } from '@island.is/auth-nest-tools'
import { ScopeTreeNode } from '../models/scopeTreeNode.model'
import { ApiScope } from '../models'
import { ApiScopesInput } from '../dto/apiScopes.input'

@Injectable()
export class ApiScopeService implements ApiScopeServiceI {
  constructor(
    private apiScopeServiceV1: ApiScopeServiceV1,
    private featureFlagService: FeatureFlagService,
  ) {}

  private async service(user: User): Promise<ApiScopeServiceI> {
    const newDelegations = await this.featureFlagService.getValue(
      Features.outgoingDelegationsV2,
      false,
      user,
    )
    // TODO: Implement ApiScopeServiceV2.
    return newDelegations ? this.apiScopeServiceV1 : this.apiScopeServiceV1
  }

  getScopeTree(
    user: User,
    input: ApiScopesInput,
  ): Promise<Array<typeof ScopeTreeNode>> {
    return this.service(user).then((service) =>
      service.getScopeTree(user, input),
    )
  }

  getApiScopes(user: User, input: ApiScopesInput): Promise<ApiScope[]> {
    return this.service(user).then((service) =>
      service.getApiScopes(user, input),
    )
  }
}
