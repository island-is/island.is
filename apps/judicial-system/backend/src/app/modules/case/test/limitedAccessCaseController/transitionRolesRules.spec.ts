import { verifyRolesRules } from '../../../../test'
import { defenderTransitionRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Transition rules', () => {
  verifyRolesRules(LimitedAccessCaseController, 'transition', [
    defenderTransitionRule,
  ])
})
