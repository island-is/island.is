import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  courtOfAppealsRoles,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { runGuardChain, verifyGuards } from '../../../../test'
import { AppealCaseController } from '../../appealCase.controller'

// The route names no case, so the per-case guards have nothing to read: the
// service reads, locks and checks each case itself. RolesGuard is all that
// runs before the handler.
describe('AppealCaseController - Complete verdict appeals guards', () => {
  verifyGuards(AppealCaseController, 'completeVerdictAppeals', [RolesGuard])
})

// Passport's jwt strategy is not registered in a unit test, so the class-level
// authentication guard stands in as a subclass that lets every user through.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

describe('AppealCaseController - Complete verdict appeals guard chain', () => {
  const runChain = (role: UserRole) =>
    runGuardChain(
      AppealCaseController,
      'completeVerdictAppeals',
      [new AuthenticatedGuard(), new RolesGuard(new Reflector())],
      {
        user: {
          currentUser: {
            role,
            institution: { type: InstitutionType.COURT_OF_APPEALS },
          } as User,
        },
        body: { appealCaseIds: [] },
      },
    )

  it.each(courtOfAppealsRoles)('should let a %s through', async (role) => {
    const then = await runChain(role)

    expect(then.error).toBeUndefined()
    expect(then.allowed).toBe(true)
  })

  it.each(
    Object.values(UserRole).filter(
      (role) => !courtOfAppealsRoles.includes(role),
    ),
  )('should reject a %s with RolesGuard', async (role) => {
    const then = await runChain(role)

    expect(then.allowed).toBe(false)
    expect(then.rejectedBy).toBe(RolesGuard.name)
  })
})
