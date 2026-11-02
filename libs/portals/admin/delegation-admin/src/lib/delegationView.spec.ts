import addDays from 'date-fns/addDays'

import { AuthDelegationType } from '@island.is/api/schema'

import {
  DelegationView,
  delegationStatus,
  filterDelegations,
  fromCustomDelegation,
} from './delegationView'

const delegation = (overrides: Partial<DelegationView>): DelegationView => ({
  id: 'id',
  type: AuthDelegationType.Custom,
  from: { name: 'From', nationalId: '0101302989' },
  to: { name: 'To', nationalId: '0101302399' },
  isActive: true,
  scopes: [],
  ...overrides,
})

const ids = (delegations: DelegationView[]) => delegations.map((d) => d.id)

describe('filterDelegations', () => {
  const works = delegation({
    id: 'works',
    clientIds: ['client'],
    loginClientIds: ['client'],
  })
  const expiredOnClient = delegation({
    id: 'expired-on-client',
    clientIds: ['client', 'other'],
    loginClientIds: ['other'],
  })
  const expired = delegation({
    id: 'expired',
    isActive: false,
    clientIds: ['client'],
    loginClientIds: [],
  })
  const otherClient = delegation({
    id: 'other-client',
    clientIds: ['other'],
    loginClientIds: ['other'],
  })
  const all = [works, expiredOnClient, expired, otherClient]

  it('lists every delegation without a client filter', () => {
    expect(filterDelegations(all, { status: 'all' })).toEqual(all)
  })

  it('lists the delegations that apply to the client', () => {
    expect(
      ids(filterDelegations(all, { status: 'all', clientId: 'client' })),
    ).toEqual(['works', 'expired-on-client', 'expired'])
  })

  it('only lists delegations that can be used to log in to the client as active', () => {
    expect(
      ids(filterDelegations(all, { status: 'active', clientId: 'client' })),
    ).toEqual(['works'])
  })

  it('lists delegations expired on the client even when active on another', () => {
    expect(
      ids(filterDelegations(all, { status: 'expired', clientId: 'client' })),
    ).toEqual(['expired-on-client', 'expired'])
  })

  it('filters by type, treating guardianship of minors as guardianship', () => {
    const guardian = delegation({
      id: 'guardian',
      type: AuthDelegationType.LegalGuardian,
    })
    const guardianMinor = delegation({
      id: 'guardian-minor',
      type: AuthDelegationType.LegalGuardianMinor,
    })
    const procuration = delegation({
      id: 'procuration',
      type: AuthDelegationType.ProcurationHolder,
    })

    expect(
      ids(
        filterDelegations([guardian, guardianMinor, procuration], {
          status: 'all',
          type: AuthDelegationType.LegalGuardian,
        }),
      ),
    ).toEqual(['guardian', 'guardian-minor'])
  })
})

describe('delegation status', () => {
  const future = addDays(new Date(), 5).toISOString()
  const later = addDays(new Date(), 30).toISOString()

  it('treats a delegation that has not started as pending in both views', () => {
    const fromAdminLookup = fromCustomDelegation({
      id: 'not-started',
      type: AuthDelegationType.Custom,
      from: { name: 'From', nationalId: '0101302989' },
      to: { name: 'To', nationalId: '0101302399' },
      scopes: [
        { name: 's1', displayName: 'S1', validFrom: future, validTo: later },
      ],
    })
    const fromOverview = delegation({
      isActive: false,
      scopes: [
        { name: 's1', displayName: 'S1', validFrom: future, validTo: later },
      ],
    })

    expect(fromAdminLookup.isActive).toBe(false)
    expect(delegationStatus(fromAdminLookup)).toBe('pending')
    expect(delegationStatus(fromOverview)).toBe('pending')
    expect(
      ids(filterDelegations([fromOverview], { status: 'pending' })),
    ).toEqual(['id'])
  })
})
