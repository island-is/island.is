import { AuthDelegationProvider } from '@island.is/shared/types'

import {
  getDelegationTypeFormValues,
  getEditableDelegationTypes,
  isDelegationProviderVisible,
} from './getDelegationTypeFormValues'

const companyRegistry = {
  id: AuthDelegationProvider.CompanyRegistry,
  delegationTypes: [{ id: 'ProcurationHolder' }],
}

const nationalRegistry = {
  id: AuthDelegationProvider.NationalRegistry,
  delegationTypes: [{ id: 'LegalGuardian' }, { id: 'LegalGuardianMinor' }],
}

const customRegistry = {
  id: AuthDelegationProvider.Custom,
  delegationTypes: [{ id: 'Custom' }],
}

const districtCommissionersRegistry = {
  id: AuthDelegationProvider.DistrictCommissionersRegistry,
  delegationTypes: [
    { id: 'LegalRepresentative' },
    { id: 'PersonalRepresentative:postholf' },
  ],
}

describe('isDelegationProviderVisible', () => {
  it.each([
    AuthDelegationProvider.CompanyRegistry,
    AuthDelegationProvider.NationalRegistry,
    AuthDelegationProvider.Custom,
  ])('should show %s to everyone', (provider) => {
    expect(isDelegationProviderVisible(provider, false)).toBe(true)
    expect(isDelegationProviderVisible(provider, true)).toBe(true)
  })

  it.each([
    AuthDelegationProvider.DistrictCommissionersRegistry,
    AuthDelegationProvider.PersonalRepresentativeRegistry,
  ])('should only show %s to super admins', (provider) => {
    expect(isDelegationProviderVisible(provider, false)).toBe(false)
    expect(isDelegationProviderVisible(provider, true)).toBe(true)
  })
})

describe('getEditableDelegationTypes', () => {
  it('should list the delegation types of the given providers', () => {
    expect(
      getEditableDelegationTypes([
        companyRegistry,
        null,
        { id: AuthDelegationProvider.Custom, delegationTypes: [null] },
        nationalRegistry,
      ]),
    ).toEqual(['ProcurationHolder', 'LegalGuardian', 'LegalGuardianMinor'])
  })
})

describe('getDelegationTypeFormValues', () => {
  it('should split the provider delegation types into supported and unsupported', () => {
    const values = getDelegationTypeFormValues({
      providers: [companyRegistry, nationalRegistry, customRegistry],
      supportedDelegationTypes: ['ProcurationHolder', 'LegalGuardian'],
    })

    expect(values).toEqual({
      addedDelegationTypes: ['ProcurationHolder', 'LegalGuardian'],
      removedDelegationTypes: ['LegalGuardianMinor', 'Custom'],
    })
  })

  it('should remove every delegation type when none are supported', () => {
    const values = getDelegationTypeFormValues({
      providers: [companyRegistry, customRegistry],
      supportedDelegationTypes: [],
    })

    expect(values).toEqual({
      addedDelegationTypes: [],
      removedDelegationTypes: ['ProcurationHolder', 'Custom'],
    })
  })

  it('should not touch delegation types of providers that were not given', () => {
    const values = getDelegationTypeFormValues({
      providers: [companyRegistry],
      supportedDelegationTypes: ['ProcurationHolder', 'LegalRepresentative'],
    })

    expect(values.addedDelegationTypes).toEqual(['ProcurationHolder'])
    expect(values.removedDelegationTypes).toEqual([])
  })

  it('should include super admin only delegation types when the provider is given', () => {
    const values = getDelegationTypeFormValues({
      providers: [companyRegistry, districtCommissionersRegistry],
      supportedDelegationTypes: ['LegalRepresentative'],
    })

    expect(values).toEqual({
      addedDelegationTypes: ['LegalRepresentative'],
      removedDelegationTypes: [
        'ProcurationHolder',
        'PersonalRepresentative:postholf',
      ],
    })
  })

  it('should ignore providers and delegation types without translations', () => {
    const values = getDelegationTypeFormValues({
      providers: [
        null,
        { id: AuthDelegationProvider.Custom, delegationTypes: [null] },
        companyRegistry,
      ],
      supportedDelegationTypes: ['ProcurationHolder'],
    })

    expect(values).toEqual({
      addedDelegationTypes: ['ProcurationHolder'],
      removedDelegationTypes: [],
    })
  })
})
