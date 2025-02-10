import { createClient } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { createNationalId } from '@island.is/testing/fixtures'

import {
  clientId,
  customScopes,
  legalGuardianScopes,
  procurationHolderScopes,
  representativeScopes,
  TestCase,
} from './delegations-filters-types'

const person1 = createNationalId('residentAdult')
const person2 = createNationalId('residentAdult')
const company1 = createNationalId('company')
const company2 = createNationalId('company')

export const testCases: Record<string, TestCase> = {
  // Returns available delegations for legal guardians
  ward1: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
    }),
    {
      fromChildren: [person1, person2],
      protectedScopes: [],
      expectedFrom: [person1, person2],
      expectedTypes: [AuthDelegationType.LegalGuardian],
    },
  ),
  // Even though individual delegations should not have protected scopes
  // we return the delegations if requireApiScopes is not set
  ward2: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
    }),
    {
      fromChildren: [person1, person2],
      protectedScopes: legalGuardianScopes,
      expectedFrom: [person1, person2],
      expectedTypes: [AuthDelegationType.LegalGuardian],
    },
  ),
  // If client has no legal guardian scopes and requireApiScopes is set
  // we return no delegations from children
  ward3: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
      requireApiScopes: true,
    }),
    {
      fromChildren: [person1, person2],
      protectedScopes: [],
      scopes: [
        ...procurationHolderScopes,
        ...customScopes,
        ...representativeScopes,
      ],
      expectedFrom: [],
    },
  ),
  // If no legal guardian scopes are unprotected and requireApiScopes is set
  // we return no delegations from children
  ward4: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
      requireApiScopes: true,
    }),
    {
      fromChildren: [person1, person2],
      protectedScopes: legalGuardianScopes,
      expectedFrom: [],
    },
  ),
  // Returns available delegations for procuration holders
  company1: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
    }),
    {
      fromCompanies: [company1, company2],
      protectedScopes: [],
      expectedFrom: [company1, company2],
      expectedTypes: [AuthDelegationType.ProcurationHolder],
    },
  ),
  // If client has no procuration holder scopes and requireApiScop is set
  // we return no delegations from companies
  company2: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
      requireApiScopes: true,
    }),
    {
      fromCompanies: [company1, company2],
      protectedScopes: [],
      scopes: [
        ...legalGuardianScopes,
        ...customScopes,
        ...representativeScopes,
      ],
      expectedFrom: [],
    },
  ),
  // If all procuration holder scopes are protected and no access
  // we don't return any delegations when requireApiScopes is set
  company3: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
      requireApiScopes: true,
    }),
    {
      fromCompanies: [company1, company2],
      protectedScopes: procurationHolderScopes,
      expectedFrom: [],
    },
  ),
  // If only some procuration holder scopes are protected
  // we return all delegations when requireApiScopes is set
  company4: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
      requireApiScopes: true,
    }),
    {
      fromCompanies: [company1, company2],
      scopes: procurationHolderScopes,
      protectedScopes: [procurationHolderScopes[0]],
      expectedFrom: [company1, company2],
      expectedTypes: [AuthDelegationType.ProcurationHolder],
    },
  ),
  // If all procuration holder scopes are protected and some access
  // we return delegations with access when requireApiScopes is set
  company5: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
      requireApiScopes: true,
    }),
    {
      fromCompanies: [company1, company2],
      scopes: procurationHolderScopes,
      protectedScopes: procurationHolderScopes,
      scopeAccess: [[company1, procurationHolderScopes[0]]],
      expectedFrom: [company1],
      expectedTypes: [AuthDelegationType.ProcurationHolder],
    },
  ),
  // Returns available delegations for custom delegations
  custom1: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
    }),
    {
      fromCustom: [person1, person2],
      protectedScopes: [],
      expectedFrom: [person1, person2],
      expectedTypes: [AuthDelegationType.Custom],
    },
  ),
  // If client has no custom scope and requireApiScope is set
  // we return no custom delegations
  custom2: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
      requireApiScopes: true,
    }),
    {
      fromCustom: [person1, person2],
      protectedScopes: [],
      scopes: [
        ...legalGuardianScopes,
        ...procurationHolderScopes,
        ...representativeScopes,
      ],
      expectedFrom: [],
    },
  ),
  // If all custom scopes are protected and no access
  // we don't return any delegations when requireApiScopes is set
  custom3: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
      requireApiScopes: true,
    }),
    {
      fromCustom: [person1, person2],
      protectedScopes: customScopes,
      expectedFrom: [],
    },
  ),
  // We return delegations where there is some unprotected scope
  // when requireApiScopes is set
  custom4: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
      requireApiScopes: true,
    }),
    {
      fromCustom: [person1, person2],
      scopes: customScopes,
      protectedScopes: [customScopes[0]],
      expectedFrom: [person1, person2],
      expectedTypes: [AuthDelegationType.Custom],
    },
  ),
  // If all custom scopes are protected and some company has access
  // we return delegations with access when requireApiScopes is set
  custom5: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
      requireApiScopes: true,
    }),
    {
      fromCustom: [company1, company2],
      scopes: customScopes,
      protectedScopes: customScopes,
      scopeAccess: [[company1, customScopes[0]]],
      expectedFrom: [company1],
      expectedTypes: [AuthDelegationType.Custom],
    },
  ),
  // If all custom scopes are protected and some person has access
  // we return no delegations when requireApiScopes is set
  custom6: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
      requireApiScopes: true,
    }),
    {
      fromCustom: [person1, company2],
      scopes: customScopes,
      protectedScopes: customScopes,
      scopeAccess: [[person1, customScopes[0]]],
      expectedFrom: [],
    },
  ),
  // If all custom scopes are protected and some person has access
  // we return the delegations when requireApiScopes is not set
  custom7: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.Custom],
    }),
    {
      fromCustom: [person1, company2],
      scopes: customScopes,
      protectedScopes: customScopes,
      scopeAccess: [[person1, customScopes[0]]],
      expectedFrom: [person1, company2],
      expectedTypes: [AuthDelegationType.Custom],
    },
  ),
  customAndWard1: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [
        AuthDelegationType.Custom,
        AuthDelegationType.LegalGuardian,
      ],
    }),
    {
      fromCustom: [person1],
      fromChildren: [person1],
      scopes: [...customScopes, ...legalGuardianScopes],
      protectedScopes: [],
      expectedFrom: [person1],
      expectedTypes: [
        AuthDelegationType.Custom,
        AuthDelegationType.LegalGuardian,
      ],
    },
  ),
  // Returns available delegations for legal representatives
  legalRepresentative1: new TestCase(
    createClient({
      clientId: clientId,
      supportedDelegationTypes: [AuthDelegationType.LegalRepresentative],
    }),
    {
      fromLegalRepresentative: [person1, person2],
      protectedScopes: [],
      expectedFrom: [person1, person2],
      expectedTypes: [AuthDelegationType.LegalRepresentative],
    },
  ),
}
