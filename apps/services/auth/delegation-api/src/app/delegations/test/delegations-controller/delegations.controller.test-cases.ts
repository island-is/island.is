import { createNationalId } from '@island.is/testing/fixtures'
import {
  personalRepresentativeRightTypeCodeFinance,
  scopes,
  TestCase,
} from './delegations.controller-test-types'
import {
  DelegationDirection,
  PersonalRepresentativeDelegationType,
} from '@island.is/auth-api-lib'

const person1 = createNationalId('person')
const person2 = createNationalId('person')
const person3 = createNationalId('person')

const Parent1 = createNationalId('person')
const child1 = createNationalId('residentChild')

const company1 = createNationalId('company')

export const validTestCases: Record<
  string,
  { message: string; testCase: TestCase }
> = {
  scopeWithLegalGuardianGrant: {
    message: 'Should only return legal guardian delegations',
    testCase: new TestCase({
      requestUser: {
        nationalId: person1,
        scope: scopes.legalGuardian.name,
      },
      toParents: [
        {
          toNationalId: Parent1,
        },
      ],
      toProcurationHolders: [
        {
          toNationalId: company1,
        },
      ],
      scopes: [scopes.legalGuardian], // only grants to legal guardians
      expectedTo: [Parent1],
    }),
  },
  scopeWithProcurationHolderGrant: {
    message: 'Should only return procuration delegations',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.procurationHolder.name,
      },
      toParents: [
        {
          toNationalId: Parent1,
        },
      ],
      toProcurationHolders: [
        {
          toNationalId: person1,
        },
        {
          toNationalId: person2,
        },
      ],
      scopes: [scopes.procurationHolder], // only grants to procuration holders
      expectedTo: [person1, person2],
    }),
  },
  scopeWithCustomDelegationGrant: {
    message: 'Should only return custom delegations',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.custom.name,
      },
      toCustom: [
        {
          toNationalId: person1,
          scopes: [scopes.custom.name],
        },
      ],
      toProcurationHolders: [
        {
          toNationalId: person1,
        },
        {
          toNationalId: person2,
        },
      ],
      scopes: [scopes.custom], // only grants to custom delegations
      expectedTo: [person1],
    }),
  },
  customDelegations: {
    message:
      'Should only return custom delegations that have the same scope as the request and have valid validTo date',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.custom.name,
      },
      toCustom: [
        {
          toNationalId: person1,
          scopes: [scopes.custom.name], // valid delegation
        },
        {
          toNationalId: person2,
          scopes: [scopes.none.name], // invalid scope
        },
        {
          toNationalId: person3,
          scopes: [scopes.custom.name],
          validTo: new Date('2021-01-01'), // invalid validTo date
        },
      ],
      scopes: [scopes.custom], // only grants to custom delegations
      expectedTo: [person1],
    }),
  },
  scopeWithNoGrants: {
    message: 'Should not return any delegations for scope that grants nothing',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.none.name,
      },
      toCustom: [
        {
          toNationalId: person1,
          scopes: [scopes.none.name],
        },
      ],
      toRepresentative: [
        {
          toNationalId: person2,
          type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
        },
      ],
      scopes: [scopes.none], // no grants
      expectedTo: [],
    }),
  },
  scopeWithPersonalRepresentativeGrant: {
    message: 'Should only return personal representative delegations',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.representative.name,
      },
      toCustom: [
        {
          toNationalId: person1,
          scopes: [scopes.representative.name],
        },
      ],
      toRepresentative: [
        {
          toNationalId: person2,
          type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
        },
      ],
      scopes: [scopes.representative], // only grants to personal representative delegations
      expectedTo: [person2],
    }),
  },
  personalRepresentativeDelegations: {
    message:
      'Should only return personal representative delegations if the scope has permission for the right type and it has valid validTo date',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.representative.name,
      },
      toRepresentative: [
        {
          toNationalId: person3,
          type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf, // scope has permission for this right type
        },
        {
          toNationalId: person2,
          type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
          validTo: new Date('2021-01-01'), // invalid validTo date
        },
        {
          toNationalId: person1,
          type: personalRepresentativeRightTypeCodeFinance as PersonalRepresentativeDelegationType, // type that scope has no permission for
        },
      ],
      scopes: [scopes.representative], // has permission for postholf right type not finance
      expectedTo: [person3],
    }),
  },
  delegationsFromOthers: {
    message:
      'Should only return delegations that are from the requested national id ',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: scopes.all.name,
      },
      toRepresentative: [
        {
          fromNationalId: person2,
          toNationalId: person3,
          type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
        },
      ],
      toCustom: [
        {
          fromNationalId: person3,
          toNationalId: person1,
          scopes: [scopes.all.name],
        },
      ],
      toProcurationHolders: [
        {
          fromNationalId: person2,
          toNationalId: person1,
        },
      ],
      toParents: [
        {
          fromNationalId: child1,
          toNationalId: Parent1,
        },
      ],
      scopes: [scopes.all], // has grants for all delegations
      expectedTo: [],
    }),
  },
  incomingDelegations: {
    message: 'should only return incoming delegations for the national id',
    testCase: new TestCase({
      requestUser: {
        nationalId: person1,
        scope: scopes.all.name,
        direction: DelegationDirection.INCOMING,
      },
      toCustom: [
        {
          fromNationalId: person3,
          toNationalId: person1,
          scopes: [scopes.all.name],
        },
      ],
      toProcurationHolders: [
        {
          fromNationalId: person2,
          toNationalId: person1,
        },
      ],
      toParents: [
        {
          fromNationalId: child1,
          toNationalId: person1,
        },
      ],
      scopes: [scopes.all], // has grants for all delegations
      expectedFrom: [person3, person2, child1],
    }),
  },
  multipleScopes: {
    message:
      'Should return delegations that match any of the multiple scopes provided',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: `${scopes.legalGuardian.name},${scopes.procurationHolder.name}`,
      },
      toParents: [
        {
          toNationalId: Parent1, // should be included (legal guardian scope)
        },
      ],
      toProcurationHolders: [
        {
          toNationalId: person1, // should be included (procuration holder scope)
        },
        {
          toNationalId: person2, // should be included (procuration holder scope)
        },
      ],
      toCustom: [
        {
          toNationalId: person3,
          scopes: [scopes.custom.name], // should NOT be included (not in requested scopes)
        },
      ],
      scopes: [scopes.legalGuardian, scopes.procurationHolder], // multiple scopes
      expectedTo: [Parent1, person1, person2],
    }),
  },
}

export const invalidTestCases: Record<
  string,
  { message: string; errorMessage: string; testCase: TestCase }
> = {
  nonExistingApiScope: {
    message: 'Should return 400 status for non-existing api scope',
    errorMessage: 'Invalid scope(s): non-existing-scope',
    testCase: new TestCase({
      requestUser: {
        nationalId: company1,
        scope: 'non-existing-scope',
      },
      scopes: [scopes.none],
      expectedTo: [],
    }),
  },
  invalidNationalId: {
    message: 'Should return 400 status for invalid national id',
    errorMessage: 'Invalid national id',
    testCase: new TestCase({
      requestUser: {
        nationalId: 'invalid-national-id',
        scope: scopes.representative.name,
      },
      scopes: [scopes.representative],
      expectedTo: [],
    }),
  },
}
