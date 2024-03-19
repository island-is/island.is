import { createNationalId } from '@island.is/testing/fixtures'
import { createClient } from '@island.is/services/auth/testing'

import { clientId, TestCase } from './delegations-index-types'

const adult1 = createNationalId('residentAdult')
const adult2 = createNationalId('residentAdult')
const child1 = createNationalId('residentChild')
const child2 = createNationalId('residentChild')
const company1 = createNationalId('company')
const company2 = createNationalId('company')
export const prRight1 = 'pr1'

export const indexingTestCases: Record<string, TestCase> = {
  // Should index custom delegations
  custom: new TestCase(
    createClient({
      clientId: clientId,
      supportsCustomDelegation: true,
    }),
    {
      fromCustom: [adult1, adult2],
      expectedFrom: [adult1, adult2],
    },
  ),
  // Should index legal guardian delegations
  ward: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
    }),
    {
      fromChildren: [child2, child1],
      expectedFrom: [child2, child1],
    },
  ), // should not index if child is 18 eighteen years old
  ward2: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
    }),
    {
      fromChildren: [adult1], // more than 18 years old
      expectedFrom: [],
    },
  ),
  // Should index procuration holders delegations
  company: new TestCase(
    createClient({
      clientId: clientId,
      supportsProcuringHolders: true,
    }),
    {
      fromCompanies: [company1, company2],
      expectedFrom: [company1, company2],
    },
  ),
  // Should index personal representatives delegations
  personalRepresentative: new TestCase(
    createClient({
      clientId: clientId,
      supportsPersonalRepresentatives: true,
    }),
    {
      fromRepresentative: [
        { fromNationalId: adult1, rightTypes: [{ code: prRight1 }] },
      ],
      expectedFrom: [adult1],
    },
  ),
}
