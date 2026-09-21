import type { User } from '@island.is/judicial-system/types'

import { RolesRule } from '../auth.types'

/**
 * Whether a roles rule is written for the user's role.
 *
 * This is the first thing `RolesGuard` asks of a rule, and the only thing
 * `RouteRolesGuard` asks of it. It lives here so the two guards cannot drift
 * apart on what "the route names this role" means - a rule is either a bare
 * `UserRole` or an object carrying one, and a second copy of that check is how
 * the two spellings get out of step.
 *
 * Internal to this library: it is deliberately not re-exported from the guards
 * barrel, because a caller outside needs one of the guards rather than the
 * predicate.
 */
export const matchesRolesRuleRole = (rule: RolesRule, user: User): boolean =>
  typeof rule === 'string' ? rule === user.role : rule?.role === user.role
