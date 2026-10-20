import { RolesRule } from '@island.is/judicial-system/auth'
import {
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { DefendantController } from '../../defendant.controller'
import { publicProsecutionProsecutorUpdateDefendantsRule } from '../../guards/rolesRules'

const userOnlyRules: RolesRule[] = [
  publicProsecutionProsecutorUpdateDefendantsRule,
]

// The controller puts RolesGuard ahead of CaseExistsForUpdateGuard at class
// level, so a caller in a role no route has a rule for is rejected before a
// write lock is taken on the case row. That ordering is only safe while no
// rule on any of its routes needs the case: a RolesRule may carry a
// canActivate that reads request.case, and prosecutorTransitionRule on the
// transition route denies outright when it is missing - which is why that
// route has to read the case first and pays for it with RouteRolesGuard.
//
// The court of appeals rules on update are field rules. Those read the body,
// which RolesGuard has before any guard runs, and not the case - so they keep
// the ordering safe too.
//
// Nothing about a rule's declaration says which kind it is, so adding a
// case-reading rule to any route here would silently turn it into a 403 and
// recreate the lock exposure at the same time. This pins the assumption to
// each route's own metadata rather than to a list retyped in a spec.
describe.each(['create', 'update', 'updateMany', 'delete'])(
  'DefendantController - %s rules',
  (methodName) => {
    const rules: RolesRule[] =
      Reflect.getMetadata(
        'roles-rules',
        DefendantController.prototype[methodName as keyof DefendantController],
      ) ?? []

    it('should declare rules at all', () => {
      expect(rules.length).toBeGreaterThan(0)
    })

    it('should decide every rule on the user alone, without reading the case', () => {
      rules.forEach((rule) => {
        // A bare UserRole is a string and has nowhere to put a canActivate; the
        // object forms may define one, and this controller's must not - except
        // the rules listed here, pinned below to decide with no case loaded.
        expect(
          typeof rule === 'string' ||
            rule.canActivate === undefined ||
            userOnlyRules.includes(rule),
        ).toBe(true)
      })
    })
  },
)

describe('publicProsecutionProsecutorUpdateDefendantsRule', () => {
  const canActivate = (institutionType: InstitutionType) => {
    if (
      typeof publicProsecutionProsecutorUpdateDefendantsRule === 'string' ||
      !publicProsecutionProsecutorUpdateDefendantsRule.canActivate
    ) {
      throw new Error('The rule must decide with a canActivate')
    }

    // No case on the request: the rule runs before the case is read.
    return publicProsecutionProsecutorUpdateDefendantsRule.canActivate({
      user: {
        currentUser: {
          role: UserRole.PROSECUTOR,
          institution: { type: institutionType },
        } as User,
      },
    })
  }

  it('should allow a prosecutor at the public prosecutors office', () => {
    expect(canActivate(InstitutionType.PUBLIC_PROSECUTORS_OFFICE)).toBe(true)
  })

  it('should deny a prosecutor at a police prosecutors office', () => {
    expect(canActivate(InstitutionType.POLICE_PROSECUTORS_OFFICE)).toBe(false)
  })
})
