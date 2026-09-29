import type { BffUser } from '@island.is/shared/types'

import {
  clearDelegationRequestGrantor,
  clearStaleDelegationRequestGrantor,
  storeDelegationRequestGrantor,
  takeDelegationRequestGrantor,
} from './delegationRequest'

const grantor = { nationalId: '0101302399', name: 'Grantor' }
const requesterNationalId = '0101307789'

const userFor = (nationalId: string, actorNationalId?: string) =>
  (({
    profile: {
      nationalId,
      ...(actorNationalId && { actor: { nationalId: actorNationalId } }),
    },
  } as unknown) as BffUser)

describe('delegationRequest grantor storage', () => {
  beforeEach(() => {
    clearDelegationRequestGrantor()
    jest.useRealTimers()
  })

  it('returns the grantor once to the requester acting as themselves', () => {
    storeDelegationRequestGrantor(grantor, requesterNationalId)

    expect(takeDelegationRequestGrantor(userFor(requesterNationalId))).toEqual(
      grantor,
    )
    expect(
      takeDelegationRequestGrantor(userFor(requesterNationalId)),
    ).toBeNull()
  })

  it('does not return the grantor to another user', () => {
    storeDelegationRequestGrantor(grantor, requesterNationalId)

    expect(takeDelegationRequestGrantor(userFor('1212121239'))).toBeNull()
  })

  it('does not return the grantor while acting on behalf of someone', () => {
    storeDelegationRequestGrantor(grantor, requesterNationalId)

    expect(
      takeDelegationRequestGrantor(
        userFor(grantor.nationalId, requesterNationalId),
      ),
    ).toBeNull()
  })

  it('does not return an expired grantor', () => {
    jest.useFakeTimers()
    storeDelegationRequestGrantor(grantor, requesterNationalId)
    jest.advanceTimersByTime(11 * 60 * 1000)

    expect(
      takeDelegationRequestGrantor(userFor(requesterNationalId)),
    ).toBeNull()
  })

  it('clears a stale grantor when the user changes', () => {
    storeDelegationRequestGrantor(grantor, requesterNationalId)

    clearStaleDelegationRequestGrantor(userFor('1212121239'))

    expect(
      takeDelegationRequestGrantor(userFor(requesterNationalId)),
    ).toBeNull()
  })

  it('keeps the grantor for the intended requester', () => {
    storeDelegationRequestGrantor(grantor, requesterNationalId)

    clearStaleDelegationRequestGrantor(userFor(requesterNationalId))

    expect(takeDelegationRequestGrantor(userFor(requesterNationalId))).toEqual(
      grantor,
    )
  })
})
