import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { ConsentScope } from '../models/consentScope.model'
import { ConsentScopeGroup } from '../models/consentScopeGroup.model'
import { ScopePermissions } from '../models/scopePermissions.model'

@Injectable()
export class ScopePermissionsService {
  async getPermissions(
    user: User,
    lang: string,
    consentedScopes: string[],
    rejectedScopes: string[],
  ): Promise<ScopePermissions[]> {
    // TODO: get scope tree from api
    // TODO: Set hasConsent flags
    return [
      {
        domainId: '@island.is',
        scopes: [
          {
            name: 'email',
            displayName: 'Netfang',
            description: 'Netfang þitt á Ísland.is',
            hasConsent: false,
          } as ConsentScope,
          {
            name: 'phone',
            displayName: 'Sími',
            description:
              'Símanúmer þitt á Ísland.is ásamt símanúmerinu sem var notað til að auðkenna þig með rafrænu skilríki.',
            hasConsent: true,
          } as ConsentScope,
        ],
      },
      {
        domainId: '@rsk.is',
        scopes: [
          {
            name: 'finance',
            displayName: 'Fjármál',
            description: 'Fjármál',
            children: [
              {
                name: 'overview',
                displayName: 'Yfirlit',
                description: 'Yfirlit.',
                hasConsent: true,
              } as ConsentScope,
            ],
          } as ConsentScopeGroup,
        ],
      },
    ]
  }
}
