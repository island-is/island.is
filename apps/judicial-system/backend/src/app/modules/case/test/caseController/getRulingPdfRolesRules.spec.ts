import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get ruling pdf rules', () => {
  verifyRolesRules(CaseController, 'getRulingPdf', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})
