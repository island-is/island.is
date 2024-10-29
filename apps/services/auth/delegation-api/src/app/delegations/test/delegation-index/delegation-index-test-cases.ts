import { generatePerson } from 'kennitala'
import faker from 'faker'

import { createClient } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { createNationalId } from '@island.is/testing/fixtures'

import { clientId, TestCase } from './delegations-index-types'

const YEAR = 1000 * 60 * 60 * 24 * 365
export const testDate = new Date(2024, 2, 1)
const today = new Date()

const adult1 = createNationalId('residentAdult')
const adult2 = createNationalId('residentAdult')
const child1 = generatePerson(
  new Date(
    Date.now() - faker.datatype.number({ min: 17 * YEAR, max: 18 * YEAR }),
  ),
) // between 17-18 years old
export const child2 = generatePerson(
  new Date(
    Date.now() - faker.datatype.number({ min: 1 * YEAR, max: 15 * YEAR }),
  ),
) // under 16 years old
const child3 = generatePerson(
  new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()),
) // exactly 16 years old
const child4 = generatePerson(
  new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
) // exactly 18 years old
const company1 = createNationalId('company')
const company2 = createNationalId('company')
export const prRight1 = 'pr1'

export const indexingTestCases: Record<string, TestCase> = {
  // Should index custom delegations
  custom: new TestCase(
    createClient({
      clientId: clientId,
      supportsCustomDelegation: true,
      supportedDelegationTypes: [AuthDelegationType.Custom],
    }),
    {
      fromCustom: [adult1, adult2],
      expectedFrom: [
        { nationalId: adult1, type: AuthDelegationType.Custom },
        { nationalId: adult2, type: AuthDelegationType.Custom },
      ],
    },
  ),
  customAndPersonalRepresentative: new TestCase(
    createClient({
      clientId: clientId,
      supportsCustomDelegation: true,
      supportsPersonalRepresentatives: true,
      supportedDelegationTypes: [AuthDelegationType.Custom, AuthDelegationType.PersonalRepresentative],
    }),
    {
      fromCustom: [adult1, adult2],
      fromRepresentative: [
        { fromNationalId: adult1, rightTypes: [{ code: prRight1 }] },
      ],
      expectedFrom: [
        { nationalId: adult1, type: AuthDelegationType.Custom },
        { nationalId: adult2, type: AuthDelegationType.Custom },
        {
          nationalId: adult1,
          type: `${AuthDelegationType.PersonalRepresentative}:${prRight1}` as AuthDelegationType,
        },
      ],
    },
  ),
  // Should index legal guardian delegations
  ward: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
    }),
    {
      fromChildren: [child2, child1],
      expectedFrom: [
        { nationalId: child2, type: AuthDelegationType.LegalGuardian },
        { nationalId: child2, type: AuthDelegationType.LegalGuardianMinor },
        { nationalId: child1, type: AuthDelegationType.LegalGuardian },
      ], // gets both LegalGuardian and LegalGuardianMinor delegation types for child2 (since they are under 16 years old)
    },
  ), // should not index if child is 18 eighteen years old
  ward2: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
    }),
    {
      fromChildren: [adult1], // more than 18 years old
      expectedFrom: [],
    },
  ),
  ward3: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
    }),
    {
      fromChildren: [child3], // exactly 16 years old
      expectedFrom: [
        { nationalId: child3, type: AuthDelegationType.LegalGuardian },
      ],
    },
  ),
  ward4: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
    }),
    {
      fromChildren: [child4], // exactly 18 years old
      expectedFrom: [],
    },
  ),
  // Should index procuration holders delegations
  company: new TestCase(
    createClient({
      clientId: clientId,
      supportsProcuringHolders: true,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
    }),
    {
      fromCompanies: [company1, company2],
      expectedFrom: [
        { nationalId: company1, type: AuthDelegationType.ProcurationHolder },
        { nationalId: company2, type: AuthDelegationType.ProcurationHolder },
      ],
    },
  ),
  // Should index personal representatives delegations
  personalRepresentative: new TestCase(
    createClient({
      clientId: clientId,
      supportsPersonalRepresentatives: true,
      supportedDelegationTypes: [AuthDelegationType.PersonalRepresentative],
    }),
    {
      fromRepresentative: [
        { fromNationalId: adult1, rightTypes: [{ code: prRight1 }] },
      ],
      expectedFrom: [
        {
          nationalId: adult1,
          type: `${AuthDelegationType.PersonalRepresentative}:${prRight1}` as AuthDelegationType,
        },
      ],
    },
  ),
  singleCustomDelegation: new TestCase(
    createClient({
      clientId: clientId,
      supportsCustomDelegation: true,
      supportedDelegationTypes: [AuthDelegationType.Custom],
    }),
    {
      fromCustom: [adult1],
      expectedFrom: [{ nationalId: adult1, type: AuthDelegationType.Custom }],
    },
  ),
  customTwoDomains: new TestCase(
    createClient({
      clientId: clientId,
      supportsCustomDelegation: true,
      supportedDelegationTypes: [AuthDelegationType.Custom],
    }),
    {
      fromCustom: [adult1],
      fromCustomOtherDomain: [adult1],
      expectedFrom: [{ nationalId: adult1, type: AuthDelegationType.Custom }],
    },
  ),
}
