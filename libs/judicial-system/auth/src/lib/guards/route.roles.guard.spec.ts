import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { User, UserRole } from '@island.is/judicial-system/types'

import { RolesRule, RulesType } from '../auth.types'
import { RouteRolesGuard } from './route.roles.guard'

describe('RouteRolesGuard', () => {
  const prosecutor = { role: UserRole.PROSECUTOR } as User

  // The guard reads the route's rules from handler metadata, so the fixture
  // sets them the way `@RolesRules()` does rather than stubbing the Reflector.
  const givenRoute = (rolesRules?: RolesRule[]) => {
    const handler = () => undefined

    if (rolesRules) {
      Reflect.defineMetadata('roles-rules', rolesRules, handler)
    }

    return handler
  }

  const whenCalled = (handler: () => void, request: unknown): boolean =>
    new RouteRolesGuard(new Reflector()).canActivate({
      getHandler: () => handler,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext)

  describe('a role the route names', () => {
    it('should allow a bare role rule', () => {
      const handler = givenRoute([UserRole.PROSECUTOR])

      expect(whenCalled(handler, { user: { currentUser: prosecutor } })).toBe(
        true,
      )
    })

    it('should allow a rule object carrying the role', () => {
      const handler = givenRoute([
        { role: UserRole.DISTRICT_COURT_JUDGE, type: RulesType.BASIC },
        { role: UserRole.PROSECUTOR, type: RulesType.BASIC },
      ])

      expect(whenCalled(handler, { user: { currentUser: prosecutor } })).toBe(
        true,
      )
    })
  })

  describe('a role the route does not name', () => {
    it('should deny', () => {
      const handler = givenRoute([
        { role: UserRole.DISTRICT_COURT_JUDGE, type: RulesType.BASIC },
      ])

      expect(whenCalled(handler, { user: { currentUser: prosecutor } })).toBe(
        false,
      )
    })
  })

  describe('a route that declares no rules', () => {
    it('should deny', () => {
      const handler = givenRoute()

      expect(whenCalled(handler, { user: { currentUser: prosecutor } })).toBe(
        false,
      )
    })
  })

  describe('a request with no user', () => {
    it('should deny', () => {
      const handler = givenRoute([UserRole.PROSECUTOR])

      expect(whenCalled(handler, {})).toBe(false)
    })
  })

  // The point of the guard: it decides from the user's role alone, so it can
  // run ahead of the guard that reads - and locks - the case row. A request
  // with no case on it at all must still be decided, both ways.
  describe('a request with no case', () => {
    it('should allow a named role without reading a case', () => {
      const handler = givenRoute([UserRole.PROSECUTOR])
      const request = { user: { currentUser: prosecutor } }

      expect(whenCalled(handler, request)).toBe(true)
      expect(request).not.toHaveProperty('case')
    })

    it('should deny an unnamed role without reading a case', () => {
      const handler = givenRoute([UserRole.DEFENDER])
      const request = { user: { currentUser: prosecutor } }

      expect(whenCalled(handler, request)).toBe(false)
      expect(request).not.toHaveProperty('case')
    })
  })

  // A rule's canActivate is what may need the case; evaluating it here is the
  // bug this guard exists to avoid.
  describe('a rule that can decide for itself', () => {
    it('should not evaluate the rule', () => {
      const canActivate = jest.fn().mockReturnValue(false)
      const handler = givenRoute([
        { role: UserRole.PROSECUTOR, type: RulesType.BASIC, canActivate },
      ])

      expect(whenCalled(handler, { user: { currentUser: prosecutor } })).toBe(
        true,
      )
      expect(canActivate).not.toHaveBeenCalled()
    })
  })
})
