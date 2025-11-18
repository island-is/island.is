import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get court record pdf rules', () => {
  verifyRolesRules(CaseController, 'getCourtRecordPdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
  ])
})
