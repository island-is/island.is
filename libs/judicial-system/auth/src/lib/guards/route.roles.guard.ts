import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { User } from '@island.is/judicial-system/types'

import { RolesRule } from '../auth.types'
import { matchesRolesRuleRole } from './rolesRuleMatching'

/**
 * A role-only pre-filter for a route's `RolesRules`, meant to run *before* any
 * guard that reads from the database.
 *
 * `RolesGuard` decides a route completely: it matches the user's role, checks
 * the dto against the rule and then lets the rule's own `canActivate` decide.
 * Some of those rules read `request.case`, so on a route whose case-exists
 * guard takes a write lock, `RolesGuard` cannot be put first - the lock is
 * taken for every authenticated caller, whatever their role, and held until
 * authorization rejects them.
 *
 * This guard answers the part of that question that needs nothing but the
 * user: does the route name this role at all? A caller in a role the route has
 * no rule for is rejected here, before the case is read and before the lock is
 * taken. Callers in a listed role carry on to `RolesGuard`, which is still the
 * guard that decides them.
 *
 * Two properties keep it honest:
 *
 * - It reads the route's rules from the same `roles-rules` metadata that
 *   `@RolesRules()` writes and `RolesGuard` reads, so it cannot drift from the
 *   declaration it is filtering on.
 * - It never calls a rule's `canActivate`. That callback is what may need the
 *   case; calling it here would reintroduce the very dependency this guard
 *   exists to stay clear of.
 *
 * It is therefore always a *narrowing* of `RolesGuard` and never a
 * replacement: every request it rejects, `RolesGuard` would have rejected too.
 * Adding it to a route cannot allow anything new.
 */
@Injectable()
export class RouteRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRules = this.reflector.get<RolesRule[]>(
      'roles-rules',
      context.getHandler(),
    )

    // Deny if no rules, as RolesGuard does
    if (!rolesRules) {
      return false
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    // Deny if no user
    if (!user) {
      return false
    }

    // Deny if the route has no rule for the user's role
    return rolesRules.some((rule) => matchesRolesRuleRole(rule, user))
  }
}
