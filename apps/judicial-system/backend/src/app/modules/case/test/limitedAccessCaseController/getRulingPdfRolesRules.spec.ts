import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { prisonSystemAdminRulingPdfRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get ruling pdf rules', () => {
  verifyRolesRules(LimitedAccessCaseController, 'getRulingPdf', [
    defenderRule,
    prisonSystemAdminRulingPdfRule,
  ])
})
