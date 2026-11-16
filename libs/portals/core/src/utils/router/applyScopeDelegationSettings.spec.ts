import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { BffUser } from '@island.is/shared/types'

import { PortalRoute } from '../../types/portalCore'
import { applyScopeDelegationSettings } from './applyScopeDelegationSettings'

const settings = [
  { name: 'personal', requestable: { individual: true, company: false } },
  { name: 'company', requestable: { individual: false, company: true } },
  { name: 'closed', requestable: { individual: false, company: false } },
]

const clientReturning = (query: jest.Mock) =>
  ({ query } as unknown as ApolloClient<NormalizedCacheObject>)

const user = (subjectType: 'person' | 'legalEntity', acting = true) =>
  ({
    profile: {
      subjectType,
      ...(acting && { actor: { nationalId: '0101302399' } }),
    },
  } as unknown as BffUser)

const person = 'person'
const company = 'legalEntity'

const routes: PortalRoute[] = [
  { name: 'Personal', path: '/a', requiredScopes: ['personal', 'closed'] },
  {
    name: 'Parent',
    path: '/b',
    requiredScopes: ['closed'],
    children: [{ name: 'Child', path: '/b/c', requiredScopes: ['company'] }],
  },
  { name: 'Open', path: '/d' },
]

describe('applyScopeDelegationSettings', () => {
  it('leaves routes untouched when not acting on behalf of someone', async () => {
    const query = jest.fn()

    const result = await applyScopeDelegationSettings({
      routes,
      userInfo: user(person, false),
      client: clientReturning(query),
    })

    expect(result).toBe(routes)
    expect(query).not.toHaveBeenCalled()
  })

  it('keeps scopes a person can be asked for and marks the rest', async () => {
    const query = jest
      .fn()
      .mockResolvedValue({ data: { authScopeDelegationSettings: settings } })

    const [personal, parent, open] = await applyScopeDelegationSettings({
      routes,
      userInfo: user(person),
      client: clientReturning(query),
    })

    expect(query).toHaveBeenCalledTimes(1)
    expect(query.mock.calls[0][0].variables.input.scopes.sort()).toEqual([
      'closed',
      'company',
      'personal',
    ])
    expect(personal.requiredScopes).toEqual(['personal'])
    expect(personal.notAvailableForActors).toBeUndefined()
    expect(parent.requiredScopes).toBeUndefined()
    expect(parent.notAvailableForActors).toBe(true)
    expect(parent.children?.[0].notAvailableForActors).toBe(true)
    expect(open).toEqual(routes[2])
  })

  it('uses what a company can be asked for when acting for a company', async () => {
    const query = jest
      .fn()
      .mockResolvedValue({ data: { authScopeDelegationSettings: settings } })

    const [personal, parent] = await applyScopeDelegationSettings({
      routes,
      userInfo: user(company),
      client: clientReturning(query),
    })

    expect(personal.notAvailableForActors).toBe(true)
    expect(parent.children?.[0].requiredScopes).toEqual(['company'])
  })

  it('offers no request and keeps the default reason when the lookup fails', async () => {
    const query = jest.fn().mockRejectedValue(new Error('down'))

    const [personal] = await applyScopeDelegationSettings({
      routes,
      userInfo: user(person),
      client: clientReturning(query),
    })

    expect(personal.requiredScopes).toBeUndefined()
    expect(personal.notAvailableForActors).toBeUndefined()
  })
})
