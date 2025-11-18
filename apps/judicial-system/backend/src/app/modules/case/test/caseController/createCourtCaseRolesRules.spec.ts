import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Create court case rules', () => {
  verifyRolesRules(CaseController, 'createCourtCase', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
