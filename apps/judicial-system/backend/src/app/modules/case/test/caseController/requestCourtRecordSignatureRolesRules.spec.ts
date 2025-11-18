import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Request court record signature rules', () => {
  verifyRolesRules(CaseController, 'requestCourtRecordSignature', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
