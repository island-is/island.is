import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'
import { districtCourtJudgeConfirmRulingOrderRule } from '../../guards/rolesRules'

describe('FileController - Confirm ruling order rules', () => {
  verifyRolesRules(FileController, 'confirmRulingOrder', [
    districtCourtJudgeConfirmRulingOrderRule,
  ])
})
