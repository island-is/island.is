import { AuthDelegationType } from '@island.is/api/schema'

import { DelegationView, filterDelegations } from './delegationView'

const delegation = (overrides: Partial<DelegationView>): DelegationView => ({
  id: 'id',
  type: AuthDelegationType.Custom,
  from: { name: 'From', nationalId: '0101302989' },
  to: { name: 'To', nationalId: '0101302399' },
  isActive: true,
  scopes: [],
  ...overrides,
})

describe('filterDelegations', () => {
  const works = delegation({
    id: 'works',
    clientIds: ['client'],
    loginClientIds: ['client'],
  })
  const doesNotWork = delegation({
    id: 'does-not-work',
    clientIds: ['client'],
    loginClientIds: [],
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
  const all = [works, doesNotWork, expired, otherClient]

  it('lists every delegation without a client filter', () => {
    expect(filterDelegations(all, { status: 'all' })).toEqual(all)
  })

  it('only lists active delegations that can be used to log in to the client', () => {
    expect(
      filterDelegations(all, { status: 'all', clientId: 'client' }).map(
        (d) => d.id,
      ),
    ).toEqual(['works', 'expired'])
  })

  it('keeps expired delegations that would apply to the client', () => {
    expect(
      filterDelegations(all, { status: 'expired', clientId: 'client' }).map(
        (d) => d.id,
      ),
    ).toEqual(['expired'])
  })
})
