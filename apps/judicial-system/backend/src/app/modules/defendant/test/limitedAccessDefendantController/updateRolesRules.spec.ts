import { verifyRolesRules } from '../../../../test'
import { prisonSystemStaffUpdateRule } from '../../guards/rolesRules'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

describe('LimitedAccessDefendantController - Update defendant roles rules', () => {
  verifyRolesRules(LimitedAccessDefendantController, 'update', [
    prisonSystemStaffUpdateRule,
  ])
})
