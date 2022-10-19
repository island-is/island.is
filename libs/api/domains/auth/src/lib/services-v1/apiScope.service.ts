import { BadRequestException, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ScopesApi } from '@island.is/clients/auth/public-api'
import { ApiScope } from '../models/apiScope.model'
import { ApiScopeGroup } from '../models/apiScopeGroup.model'
import { ScopeTreeNode } from '../models/scopeTreeNode.model'
import { ApiScopeServiceInterface } from '../services/types'
import { ApiScopesInput } from '../dto/apiScopes.input'
import { ISLAND_DOMAIN } from './constants'

@Injectable()
export class ApiScopeServiceV1 implements ApiScopeServiceInterface {
  constructor(private scopesApi: ScopesApi) {}

  private scopesApiWithAuth(auth: Auth) {
    return this.scopesApi.withMiddleware(new AuthMiddleware(auth))
  }

  getApiScopes(user: User, input: ApiScopesInput): Promise<ApiScope[]> {
    this.checkDomain(input.domain)

    return this.scopesApiWithAuth(
      user,
    ).scopesControllerFindAllWithExplicitDelegationGrant({ locale: input.lang })
  }

  async getScopeTree(
    user: User,
    input: ApiScopesInput,
  ): Promise<Array<typeof ScopeTreeNode>> {
    this.checkDomain(input.domain)

    const scopes = await this.scopesApiWithAuth(
      user,
    ).scopesControllerFindAllWithExplicitDelegationGrant({
      locale: input.lang,
    })
    const groupChildren = new Map<string, ApiScope[]>()
    const tree: Array<typeof ScopeTreeNode> = []
    for (const scope of scopes) {
      if (scope.group) {
        let children = groupChildren.get(scope.group.id)
        if (!children) {
          children = []
          const group = new ApiScopeGroup({
            name: scope.group.name,
            description: scope.group.description,
            displayName: scope.group.displayName,
            children,
          })
          tree.push(group)
          groupChildren.set(scope.group.id, children)
        }
        children.push(scope)
      } else {
        tree.push(
          new ApiScope({
            name: scope.name,
            displayName: scope.displayName,
            description: scope.description,
          }),
        )
      }
    }

    return tree
  }

  private checkDomain(domain?: string) {
    if ((domain ?? ISLAND_DOMAIN) !== ISLAND_DOMAIN) {
      throw new BadRequestException(`Can only specify ${ISLAND_DOMAIN} domain`)
    }
  }
}
