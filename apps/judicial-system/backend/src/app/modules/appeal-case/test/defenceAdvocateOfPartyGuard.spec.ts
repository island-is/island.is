import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import { UserRole } from '@island.is/judicial-system/types'

import { DefenceAdvocateOfPartyGuard } from '../guards/defenceAdvocateOfParty.guard'

describe('DefenceAdvocateOfPartyGuard', () => {
  const guard = new DefenceAdvocateOfPartyGuard()

  const activate = (request: Record<string, unknown>) =>
    guard.canActivate({
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext)

  const defender = { role: UserRole.DEFENDER, nationalId: '0101302989' }

  const ownDefendant = {
    id: 'own-defendant-id',
    isDefenderChoiceConfirmed: true,
    defenderNationalId: '0101302989',
  }

  const ownClaimant = {
    id: 'own-claimant-id',
    hasSpokesperson: true,
    isSpokespersonConfirmed: true,
    spokespersonNationalId: '0101302989',
  }

  it('lets a defender at their own client', () => {
    expect(
      activate({ user: { currentUser: defender }, defendant: ownDefendant }),
    ).toBe(true)
  })

  it('lets a spokesperson at their own claimant', () => {
    expect(
      activate({ user: { currentUser: defender }, civilClaimant: ownClaimant }),
    ).toBe(true)
  })

  it("keeps a defender away from another defendant's letter", () => {
    expect(() =>
      activate({
        user: { currentUser: defender },
        defendant: { ...ownDefendant, defenderNationalId: '0909713459' },
      }),
    ).toThrow(ForbiddenException)
  })

  // The district court's confirmation is what grants access to the case; a
  // defender picked but not yet confirmed does not act for the party.
  it('keeps an unconfirmed defender away', () => {
    expect(() =>
      activate({
        user: { currentUser: defender },
        defendant: { ...ownDefendant, isDefenderChoiceConfirmed: false },
      }),
    ).toThrow(ForbiddenException)
  })

  it.each([
    ['not confirmed', { isSpokespersonConfirmed: false }],
    ['not recorded', { hasSpokesperson: false }],
  ])('keeps a spokesperson away when they are %s', (_name, fields) => {
    expect(() =>
      activate({
        user: { currentUser: defender },
        civilClaimant: { ...ownClaimant, ...fields },
      }),
    ).toThrow(ForbiddenException)
  })

  it("keeps a spokesperson away from another claimant's letter", () => {
    expect(() =>
      activate({
        user: { currentUser: defender },
        civilClaimant: { ...ownClaimant, spokespersonNationalId: '0909713459' },
      }),
    ).toThrow(ForbiddenException)
  })

  // The party guard before this one puts the party on the request; a request
  // without one is a misordered chain, which is not something to refuse the
  // user over.
  it('fails a request that names no party', () => {
    expect(() => activate({ user: { currentUser: defender } })).toThrow(
      InternalServerErrorException,
    )
  })

  it('fails a request without a user', () => {
    expect(() => activate({ defendant: ownDefendant })).toThrow(
      InternalServerErrorException,
    )
  })

  // Which non-defence roles the route admits is the role rules' business.
  it('passes anyone who is not a defence user', () => {
    expect(
      activate({
        user: { currentUser: { role: UserRole.PUBLIC_PROSECUTOR_STAFF } },
        defendant: { ...ownDefendant, defenderNationalId: '0909713459' },
      }),
    ).toBe(true)
  })
})
