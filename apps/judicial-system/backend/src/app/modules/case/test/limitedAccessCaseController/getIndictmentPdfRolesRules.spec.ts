import { verifyRolesRules } from '../../../../test'
import { defenderGeneratedPdfRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get indictment pdf rules', () => {
  verifyRolesRules(LimitedAccessCaseController, 'getIndictmentPdf', [
    defenderGeneratedPdfRule,
  ])
})
