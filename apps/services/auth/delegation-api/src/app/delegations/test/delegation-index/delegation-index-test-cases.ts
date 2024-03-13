import { createNationalId } from '@island.is/testing/fixtures'
import { createClient } from '@island.is/services/auth/testing'

import { clientId, TestCase } from './delegations-index-types'

const person1 = createNationalId('person')
const person2 = createNationalId('person')
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
      fromCustom: [person1, person2],
      expectedFrom: [person1, person2],
    },
  ),
  // Should index legal guardian delegations
  ward: new TestCase(
    createClient({
      clientId: clientId,
      supportsLegalGuardians: true,
    }),
    {
      fromChildren: [person1, person2],
      expectedFrom: [person1, person2],
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
        { fromNationalId: person1, rightType: { code: prRight1 } },
      ],
      expectedFrom: [person1],
    },
  ),
}
