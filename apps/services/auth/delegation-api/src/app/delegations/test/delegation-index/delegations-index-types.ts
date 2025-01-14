import { User } from '@island.is/auth-nest-tools'
import { GetIndividualRelationships } from '@island.is/clients-rsk-relationships'
import {
  CreateApiScope,
  CreateClient,
  CreateCustomDelegation,
  CreateDomain,
  CreatePersonalRepresentativeDelegation,
} from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'

export const clientId = '@island.is/webapp'
export const domainName = '@island.is'
const otherDomainName = '@other.is/webapp'
export const user = createCurrentUser({
  nationalIdType: 'person',
  client: clientId,
})

export const legalGuardianScopes = ['lg1', 'lg2']
export const procurationHolderScopes = ['ph1', 'ph2']
export const customScopes = ['cu1', 'cu2']
export const customScopesOtherDomain = ['cu-od1', 'cu-od2']
export const representativeScopes = ['pr1', 'pr2']

export interface ITestCaseOptions {
  fromChildren?: string[]
  fromCompanies?: string[]
  fromCustom?: string[]
  fromCustomOtherDomain?: string[]
  fromRepresentative?: CreatePersonalRepresentativeDelegation[]
  scopes?: string[]
  scopeAccess?: [string, string][]
  expectedFrom: { nationalId: string; type: AuthDelegationType }[]
  representativeRights?: string[]
}

export class TestCase {
  domainName = domainName
  otherDomainName = otherDomainName
  user: User
  client: CreateClient
  fromChildren: string[]
  fromCompanies: string[]
  fromCustom: string[]
  fromCustomOtherDomain: string[]
  fromRepresentative: CreatePersonalRepresentativeDelegation[]
  scopes: string[]
  scopesOtherDomain: string[]
  scopeAccess: [string, string][]
  expectedFrom: { nationalId: string; type: AuthDelegationType }[]

  constructor(client: CreateClient, options: ITestCaseOptions) {
    this.client = client
    this.user = user
    this.fromChildren = options.fromChildren ?? []
    this.fromCompanies = options.fromCompanies ?? []
    this.fromCustom = options.fromCustom ?? []
    this.fromCustomOtherDomain = options.fromCustomOtherDomain ?? []
    this.fromRepresentative = options.fromRepresentative ?? []
    this.scopes = options.scopes ?? [
      ...legalGuardianScopes,
      ...procurationHolderScopes,
      ...customScopes,
      ...representativeScopes,
    ]
    this.scopesOtherDomain = customScopesOtherDomain
    this.scopeAccess = options.scopeAccess ?? []
    this.expectedFrom = options.expectedFrom
  }

  get domains(): CreateDomain[] {
    return [{ name: this.domainName }, { name: this.otherDomainName }]
  }

  get apiScopes(): CreateApiScope[] {
    return [...this.scopes, ...this.scopesOtherDomain].map((s) => ({
      name: s,
      description: s,
      displayName: s,
      domainName: this.scopesOtherDomain.includes(s)
        ? this.otherDomainName
        : this.domainName,
      grantToLegalGuardians: legalGuardianScopes.includes(s),
      grantToProcuringHolders: procurationHolderScopes.includes(s),
      allowExplicitDelegationGrant: customScopes.includes(s),
      grantToPersonalRepresentatives: representativeScopes.includes(s),
      supportedDelegationTypes: this.supportedDelegationTypes(s),
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

  get customDelegationsOtherDomain(): CreateCustomDelegation[] {
    return this.fromCustomOtherDomain.map((d: string) => ({
      domainName: this.otherDomainName,
      toNationalId: this.user.nationalId,
      fromNationalId: d,
      scopes: this.scopesOtherDomain.map((s) => ({
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

  get personalRepresentativeDelegation(): CreatePersonalRepresentativeDelegation[] {
    return this.fromRepresentative.map(
      (d: CreatePersonalRepresentativeDelegation) => ({
        toNationalId: this.user.nationalId,
        fromNationalId: d.fromNationalId,
        rightTypes: d.rightTypes,
      }),
    )
  }

  supportedDelegationTypes = (scopeName: string): AuthDelegationType[] => {
    const result = []

    if (legalGuardianScopes.includes(scopeName)) {
      result.push(AuthDelegationType.LegalGuardian)
    }
    if (procurationHolderScopes.includes(scopeName)) {
      result.push(AuthDelegationType.ProcurationHolder)
    }
    if (
      customScopes.includes(scopeName) ||
      customScopesOtherDomain.includes(scopeName)
    ) {
      result.push(AuthDelegationType.Custom)
    }
    if (representativeScopes.includes(scopeName)) {
      result.push(AuthDelegationType.PersonalRepresentative)
    }
    return result
  }
}
