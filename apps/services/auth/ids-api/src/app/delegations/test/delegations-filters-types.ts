import { User } from '@island.is/auth-nest-tools'
import { ClientAllowedScope } from '@island.is/auth-api-lib'
import {
  CreateApiScope,
  CreateApiScopeUserAccess,
  CreateClient,
  CreateCustomDelegation,
  CreateDomain,
} from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { GetIndividualRelationships } from '@island.is/clients-rsk-relationships'

export const clientId = '@island.is/webapp'

export const user = createCurrentUser({
  nationalIdType: 'person',
  scope: ['@identityserver.api/authentication'],
  client: clientId,
})

export const legalGuardianScopes = ['lg1', 'lg2']
export const procurationHolderScopes = ['ph1', 'ph2']
export const customScopes = ['cu1', 'cu2']
export const representativeScopes = ['pr1', 'pr2']

export interface ITestCaseOptions {
  fromChildren?: string[]
  fromCompanies?: string[]
  fromCustom?: string[]
  fromRepresentative?: string[]
  scopes?: string[]
  protectedScopes?: string[]
  scopeAccess?: [string, string][]
  expectedFrom: string[]
}

export class TestCase {
  domainName = '@island.is'
  user: User
  client: CreateClient
  fromChildren: string[]
  fromCompanies: string[]
  fromCustom: string[]
  fromRepresentative: string[]
  scopes: string[]
  protectedScopes: string[]
  scopeAccess: [string, string][]
  expectedFrom: string[]

  constructor(client: CreateClient, options: ITestCaseOptions) {
    this.client = client
    this.fromChildren = options.fromChildren ?? []
    this.fromCompanies = options.fromCompanies ?? []
    this.fromCustom = options.fromCustom ?? []
    this.fromRepresentative = options.fromRepresentative ?? []
    this.scopes = options.scopes ?? [
      ...legalGuardianScopes,
      ...procurationHolderScopes,
      ...customScopes,
      ...representativeScopes,
    ]
    this.protectedScopes = options.protectedScopes ?? []
    this.scopeAccess = options.scopeAccess ?? []
    this.expectedFrom = options.expectedFrom
  }

  get domain(): CreateDomain {
    return { name: this.domainName }
  }

  get apiScopes(): CreateApiScope[] {
    return this.scopes.map((s) => ({
      name: s,
      description: s,
      displayName: s,
      domainName: this.domainName,
      grantToLegalGuardians: legalGuardianScopes.includes(s),
      grantToProcuringHolders: procurationHolderScopes.includes(s),
      allowExplicitDelegationGrant: customScopes.includes(s),
      grantToPersonalRepresentatives: representativeScopes.includes(s),
      isAccessControlled: this.protectedScopes.includes(s),
    }))
  }

  get clientAllowedScopes(): Partial<ClientAllowedScope>[] {
    return this.scopes.map((s: string) => ({
      scopeName: s,
      clientId: this.client.clientId,
    }))
  }

  get customDelegations(): CreateCustomDelegation[] {
    return this.fromCustom.map((d: string) => ({
      domainName: this.domainName,
      toNationalId: this.user.nationalId,
      fromNationalId: d,
      scopes: this.scopes
        .filter((s) => customScopes.includes(s))
        .map((s) => ({
          scopeName: s,
        })),
    }))
  }

  get procuration(): GetIndividualRelationships {
    return {
      nationalId: this.user.nationalId,
      name: '',
      relationships: this.fromCompanies.map((c) => ({
        nationalId: c,
        name: '',
      })),
    }
  }

  get apiScopeUserAccess(): CreateApiScopeUserAccess[] {
    return this.scopeAccess.map((access) => ({
      nationalId: access[0],
      scope: access[1],
    }))
  }
}
