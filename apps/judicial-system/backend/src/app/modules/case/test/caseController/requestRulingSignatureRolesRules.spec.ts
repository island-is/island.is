import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'
import { districtCourtJudgeSignRulingRule } from '../../guards/rolesRules'

describe('CaseController - Request ruling signature rules', () => {
  verifyRolesRules(CaseController, 'requestRulingSignature', [
    districtCourtJudgeSignRulingRule,
  ])
})
