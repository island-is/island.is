import { CaseType, UserRole } from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { prosecutorTransitionRule } from '../../guards/rolesRules'

// prosecutorTransitionRule decides from the case, not just from the user and
// the DTO, which is why CaseExistsForUpdateGuard has to run before RolesGuard
// on the transition route. That ordering looks like it could be reversed to
// avoid taking a write lock on behalf of an unauthorized caller - it cannot,
// and nothing else fails when it is: guards do not run in controller unit
// tests, so the whole suite stays green while every prosecutor transition
// returns 403. These tests exist to make the dependency explicit.
describe('prosecutorTransitionRule', () => {
  const user = { role: UserRole.PROSECUTOR, canConfirmIndictment: false }

  const canActivate = (request: unknown) =>
    prosecutorTransitionRule.canActivate?.(
      request as Parameters<
        NonNullable<typeof prosecutorTransitionRule.canActivate>
      >[0],
    )

  it('should deny when the case has not been read onto the request', () => {
    expect(
      canActivate({
        user: { currentUser: user },
        body: { transition: 'SUBMIT' },
      }),
    ).toBe(false)
  })

  it('should allow the same request once the case is on it', () => {
    expect(
      canActivate({
        user: { currentUser: user },
        body: { transition: 'SUBMIT' },
        case: { type: CaseType.CUSTODY } as Case,
      }),
    ).toBe(true)
  })

  it('should read the case type when submitting an indictment', () => {
    const submitIndictment = (canConfirmIndictment: boolean) =>
      canActivate({
        user: { currentUser: { ...user, canConfirmIndictment } },
        body: { transition: 'SUBMIT' },
        case: { type: CaseType.INDICTMENT } as Case,
      })

    // The decision is the user's confirmation right, but reaching it at all
    // depends on the case being there to be typed.
    expect(submitIndictment(false)).toBe(false)
    expect(submitIndictment(true)).toBe(true)
  })
})
