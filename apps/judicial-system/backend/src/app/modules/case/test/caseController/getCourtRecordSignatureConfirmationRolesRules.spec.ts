import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get court record signature confirmation rules', () => {
  verifyRolesRules(CaseController, 'getCourtRecordSignatureConfirmation', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
