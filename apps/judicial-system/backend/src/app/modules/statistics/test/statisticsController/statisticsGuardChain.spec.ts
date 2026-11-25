import { v4 as uuid } from 'uuid'

import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { User, UserRole } from '@island.is/judicial-system/types'

import { runGuardChain } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

// Both routes' guards, executed rather than merely declared.
//
// The *Guards and *RolesRules specs pin what is declared; this table runs it,
// with a real Reflector so RolesGuard resolves each route's own rules. Passport's
// jwt strategy is not registered in a unit test, so authentication stands in as
// a subclass - the chain still refuses to run if the controller gains a guard
// this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const allowedRoles = [UserRole.ADMIN, UserRole.LOCAL_ADMIN]
const rejectedRoles = Object.values(UserRole).filter(
  (role) => !allowedRoles.includes(role),
)

describe.each(['getStatistics', 'exportCaseEventData'])(
  'StatisticsController - %s guard chain',
  (methodName) => {
    const guards = [new AuthenticatedGuard(), new RolesGuard(new Reflector())]

    const runChain = (user?: User) =>
      runGuardChain(StatisticsController, methodName, guards, {
        user: user && { currentUser: user },
      })

    it.each(allowedRoles)('should let %s through', async (role) => {
      const then = await runChain({ id: uuid(), role } as User)

      expect(then.error).toBeUndefined()
      expect(then).toEqual({ allowed: true })
    })

    it.each(rejectedRoles)('should have RolesGuard reject %s', async (role) => {
      const then = await runChain({ id: uuid(), role } as User)

      expect(then).toEqual({ allowed: false, rejectedBy: RolesGuard.name })
    })

    it('should have RolesGuard reject a request with no user', async () => {
      const then = await runChain()

      expect(then).toEqual({ allowed: false, rejectedBy: RolesGuard.name })
    })
  },
)
