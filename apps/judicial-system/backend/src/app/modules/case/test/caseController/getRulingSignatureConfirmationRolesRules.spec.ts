import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'
import { districtCourtJudgeSignRulingRule } from '../../guards/rolesRules'

describe('CaseController - Get ruling signature confirmation rules', () => {
  verifyRolesRules(CaseController, 'getRulingSignatureConfirmation', [
    districtCourtJudgeSignRulingRule,
  ])
})
