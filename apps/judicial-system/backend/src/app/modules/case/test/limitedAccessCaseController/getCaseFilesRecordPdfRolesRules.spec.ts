import { verifyRolesRules } from '../../../../test'
import { defenderGeneratedPdfRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get case files record pdf rules', () => {
  verifyRolesRules(LimitedAccessCaseController, 'getCaseFilesRecordPdf', [
    defenderGeneratedPdfRule,
  ])
})
