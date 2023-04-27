import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ScopeNodeDTO, ScopesApi } from '@island.is/clients/auth/delegation-api'

import { ConsentScopeNode } from '../models/consentScopeNode.model'
import { ScopePermissions } from '../models/scopePermissions.model'

@Injectable()
export class ScopePermissionsService {
  constructor(private readonly scopesApi: ScopesApi) {}

  private scopesApiWithAuth(auth: Auth) {
    return this.scopesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private scopeNodeMapper(
    node: ScopeNodeDTO,
    consentedScopes: string[],
  ): ConsentScopeNode {
    return {
      name: node.name,
      displayName: node.displayName,
      description: node.description,
      children: node.children
        ? node.children.map((child) =>
            this.scopeNodeMapper(child, consentedScopes),
          )
        : [],
      hasConsent: consentedScopes.includes(node.name),
    }
  }

  async getPermissions(
    user: User,
    lang: string,
    consentedScopes: string[],
    rejectedScopes: string[],
  ): Promise<ScopePermissions[]> {
    const response = await this.scopesApiWithAuth(
      user,
    ).scopesControllerFindScopeTree({
      requestedScopes: [...consentedScopes, ...rejectedScopes],
      lang,
    })

    const map = new Map<string, ScopeNodeDTO[]>()
    response.forEach((item) => {
      const key = item.domainName
      const existing = map.get(key)
      if (!existing) {
        map.set(key, [item])
      } else {
        existing.push(item)
      }
    })

    const result: ScopePermissions[] = []
    map.forEach((value, key) => {
      result.push({
        domainName: key,
        scopes: value.map((node) =>
          this.scopeNodeMapper(node, consentedScopes),
        ),
      })
    })

    return result
  }
}
