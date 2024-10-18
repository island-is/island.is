import { ClientAllowedScope } from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { GetIndividualRelationships } from '@island.is/clients-rsk-relationships'
import {
  CreateApiScope,
  CreateApiScopeUserAccess,
  CreateClient,
  CreateCustomDelegation,
  CreateDomain,
} from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'

export const clientId = '@island.is/webapp'
export const domainName = '@island.is'
export const otherDomainName = '@otherdomain.is'
export const user = createCurrentUser({
  nationalIdType: 'person',
  scope: ['@identityserver.api/authentication'],
  client: clientId,
})

const legalGuardianScope1 = 'lg1'
const legalGuardianScope2 = 'lg2'
const procurationHolderScope1 = 'ph1'
const procurationHolderScope2 = 'ph2'
const customScope1 = 'cu1'
const customScope2 = 'cu2'
const customScopeOtherDomain = 'cu-od1'
const representativeScope1 = 'pr1'
const representativeScope2 = 'pr2'
const legalRepresentativeScope1 = 'lr1'
const legalRepresentativeScope2 = 'lr2'

export const legalGuardianScopes = [legalGuardianScope1, legalGuardianScope2]
export const procurationHolderScopes = [
  procurationHolderScope1,
  procurationHolderScope2,
]
export const customScopes = [customScope1, customScope2, customScopeOtherDomain]
export const representativeScopes = [representativeScope1, representativeScope2]
export const legalRepresentativeScopes = [
  legalRepresentativeScope1,
  legalRepresentativeScope2,
]

export interface ITestCaseOptions {
  fromChildren?: string[]
  fromCompanies?: string[]
  fromCustom?: string[]
  fromRepresentative?: string[]
  fromLegalRepresentative?: string[]
  scopes?: string[]
  protectedScopes?: string[]
  scopeAccess?: [string, string][]
  expectedFrom: string[]
  expectedTypes?: AuthDelegationType[]
}

export class TestCase {
  domainName = domainName
  otherDomainName = otherDomainName
  user: User
  client: CreateClient
  fromChildren: string[]
  fromCompanies: string[]
  fromCustom: string[]
  fromRepresentative: string[]
  fromLegalRepresentative: string[]
  scopes: string[]
  protectedScopes: string[]
  scopeAccess: [string, string][]
  expectedFrom: string[]
  expectedTypes?: AuthDelegationType[]

  constructor(client: CreateClient, options: ITestCaseOptions) {
    this.client = client
    this.fromChildren = options.fromChildren ?? []
    this.fromCompanies = options.fromCompanies ?? []
    this.fromCustom = options.fromCustom ?? []
    this.fromRepresentative = options.fromRepresentative ?? []
    this.fromLegalRepresentative = options.fromLegalRepresentative ?? []
    this.scopes = options.scopes ?? [
      ...legalGuardianScopes,
      ...procurationHolderScopes,
      ...customScopes,
      ...representativeScopes,
      ...legalRepresentativeScopes,
    ]
    this.protectedScopes = options.protectedScopes ?? []
    this.scopeAccess = options.scopeAccess ?? []
    this.expectedFrom = options.expectedFrom
    this.expectedTypes = options.expectedTypes
  }

  get domains(): CreateDomain[] {
    const domains = [{ name: this.domainName }]
    if (this.otherDomainName) {
      domains.push({ name: this.otherDomainName })
    }
    return domains
  }

  get apiScopes(): CreateApiScope[] {
    return this.scopes.map((s) => ({
      name: s,
      description: s,
      displayName: s,
      domainName:
        s === customScopeOtherDomain ? this.otherDomainName : this.domainName,
      grantToLegalGuardians: legalGuardianScopes.includes(s),
      grantToProcuringHolders: procurationHolderScopes.includes(s),
      allowExplicitDelegationGrant: customScopes.includes(s),
      grantToPersonalRepresentatives: representativeScopes.includes(s),
      isAccessControlled: this.protectedScopes.includes(s),
      supportedDelegationTypes: this.supportedDelegationTypes(s),
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

  supportedDelegationTypes = (scopeName: string): AuthDelegationType[] => {
    const result = []

    if (legalGuardianScopes.includes(scopeName)) {
      result.push(AuthDelegationType.LegalGuardian)
    }
    if (procurationHolderScopes.includes(scopeName)) {
      result.push(AuthDelegationType.ProcurationHolder)
    }
    if (customScopes.includes(scopeName)) {
      result.push(AuthDelegationType.Custom)
    }
    if (representativeScopes.includes(scopeName)) {
      result.push(AuthDelegationType.PersonalRepresentative)
    }
    if (legalRepresentativeScopes.includes(scopeName)) {
      result.push(AuthDelegationType.LegalRepresentative)
    }
    return result
  }
}
