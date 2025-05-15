import {
  CreateClient,
  CreateDomain,
  CreateApiScope,
  CreateDelegationIndexRecord,
  CreatePersonalRepresentativeScopePermission,
} from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import {
  DelegationDirection,
  PersonalRepresentativeDelegationType,
} from '@island.is/auth-api-lib'
import { createClient } from '@island.is/services/auth/testing'
import { AuthScope } from '@island.is/auth/scopes'

export const clientId = '@island.is/webapp'
export const domainName = '@island.is'
export const user = createCurrentUser({
  client: clientId,
  scope: [AuthScope.delegationIndex],
})
export const userWithWrongScope = createCurrentUser({
  client: clientId,
  scope: ['wrong-scope'],
})
export const personalRepresentativeRightTypeCodePostholf = 'postholf'
export const personalRepresentativeRightTypeCodeFinance = 'finance'

type DelegationRecordInput = {
  fromNationalId?: string
  toNationalId: string
}

type CustomDelegationRecordInput = DelegationRecordInput & {
  scopes: string[]
  validTo?: Date
}

type PersonalRepresentativeDelegationInput = DelegationRecordInput & {
  type: PersonalRepresentativeDelegationType
  validTo?: Date
}

type GetDelegationIndexRecordsInput = {
  scope: string
  nationalId: string
  direction?: DelegationDirection
}

type TestCaseResults =
  | {
      expectedFrom: string[] // used to test incoming delegations
      expectedTo?: never
    }
  | {
      expectedTo: string[] // used to test outgoing delegations
      expectedFrom?: never
    }

export type ITestCaseOptions = {
  requestUser: GetDelegationIndexRecordsInput
  toParents?: DelegationRecordInput[]
  toProcurationHolders?: DelegationRecordInput[]
  toCustom?: CustomDelegationRecordInput[]
  toRepresentative?: PersonalRepresentativeDelegationInput[]
  scopes?: Scope[]
} & TestCaseResults

type Scope = {
  name: string
  grantToLegalGuardians?: boolean
  grantToProcuringHolders?: boolean
  allowExplicitDelegationGrant?: boolean
  grantToPersonalRepresentatives?: boolean
  personalRepresentativeRightTypePermissions?: string[]
}

export const scopes: Record<string, Scope> = {
  legalGuardian: {
    name: '@lg1',
    grantToLegalGuardians: true,
    supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
  },
  procurationHolder: {
    name: '@ph1',
    grantToProcuringHolders: true,
    supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
  },
  custom: {
    name: '@cu1',
    allowExplicitDelegationGrant: true,
    supportedDelegationTypes: [AuthDelegationType.Custom],
  },
  custom2: {
    name: '@cu2',
    allowExplicitDelegationGrant: true,
    supportedDelegationTypes: [AuthDelegationType.Custom],
  },
  representative: {
    name: '@pr1',
    grantToPersonalRepresentatives: true,
    personalRepresentativeRightTypePermissions: [
      personalRepresentativeRightTypeCodePostholf,
    ],
    supportedDelegationTypes: [
      PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
    ],
  },
  all: {
    name: '@all',
    grantToLegalGuardians: true,
    grantToProcuringHolders: true,
    grantToPersonalRepresentatives: true,
    allowExplicitDelegationGrant: true,
    personalRepresentativeRightTypePermissions: [
      personalRepresentativeRightTypeCodePostholf,
    ],
    supportedDelegationTypes: [
      AuthDelegationType.LegalGuardian,
      AuthDelegationType.ProcurationHolder,
      AuthDelegationType.Custom,
      AuthDelegationType.PersonalRepresentative,
    ],
  },
  none: {
    name: '@none',
    supportedDelegationTypes: [],
  },
}

export class TestCase {
  domainName = domainName
  requestUser: GetDelegationIndexRecordsInput
  client: CreateClient
  toParents: DelegationRecordInput[]
  toProcurationHolders: DelegationRecordInput[]
  toCustom: CustomDelegationRecordInput[]
  toRepresentative: PersonalRepresentativeDelegationInput[]
  scopes: Scope[]
  expectedTo?: string[]
  expectedFrom?: string[]

  constructor(options: ITestCaseOptions) {
    this.client = createClient({ clientId })
    this.requestUser = options.requestUser
    this.toParents = options.toParents ?? []
    this.toProcurationHolders = options.toProcurationHolders ?? []
    this.toCustom = options.toCustom ?? []
    this.toRepresentative = options.toRepresentative ?? []
    this.scopes = options.scopes ?? Object.values(scopes)
    this.expectedTo = options.expectedTo
    this.expectedFrom = options.expectedFrom
  }

  get domain(): CreateDomain {
    return { name: this.domainName }
  }

  get apiScopes(): CreateApiScope[] {
    return this.scopes.map((s) => ({
      name: s.name,
      description: s.name,
      displayName: s.name,
      domainName: this.domainName,
      grantToLegalGuardians: s.grantToLegalGuardians,
      grantToProcuringHolders: s.grantToProcuringHolders,
      allowExplicitDelegationGrant: s.allowExplicitDelegationGrant,
      grantToPersonalRepresentatives: s.grantToPersonalRepresentatives,
      supportedDelegationTypes: s.supportedDelegationTypes,
    }))
  }

  get customDelegationRecord(): CreateDelegationIndexRecord[] {
    return this.toCustom.map((record) => ({
      fromNationalId: record.fromNationalId ?? this.requestUser.nationalId,
      toNationalId: record.toNationalId,
      provider: AuthDelegationProvider.Custom,
      type: AuthDelegationType.Custom,
      validTo: record.validTo,
      customDelegationScopes: record.scopes,
    }))
  }

  get procurationDelegationRecords(): CreateDelegationIndexRecord[] {
    return this.toProcurationHolders.map((record) => ({
      fromNationalId: record.fromNationalId ?? this.requestUser.nationalId,
      toNationalId: record.toNationalId,
      provider: AuthDelegationProvider.CompanyRegistry,
      type: AuthDelegationType.ProcurationHolder,
    }))
  }

  get personalRepresentativeDelegationRecords(): CreateDelegationIndexRecord[] {
    return this.toRepresentative.map((record) => ({
      fromNationalId: record.fromNationalId ?? this.requestUser.nationalId,
      toNationalId: record.toNationalId,
      provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
      type: record.type,
      validTo: record.validTo,
    }))
  }

  get wardDelegationRecords(): CreateDelegationIndexRecord[] {
    return this.toParents.map((record) => ({
      fromNationalId: record.fromNationalId ?? this.requestUser.nationalId,
      toNationalId: record.toNationalId,
      provider: AuthDelegationProvider.NationalRegistry,
      type: AuthDelegationType.LegalGuardian,
    }))
  }

  get personalRepresentativeScopePermissions(): CreatePersonalRepresentativeScopePermission[] {
    return this.scopes
      .filter((scope) => scope.personalRepresentativeRightTypePermissions)
      .map((scope) =>
        scope.personalRepresentativeRightTypePermissions?.map((rightType) => ({
          rightTypeCode: rightType,
          apiScopeName: scope.name,
        })),
      )
      .flat() as CreatePersonalRepresentativeScopePermission[]
  }
}
