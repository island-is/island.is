import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Create Roles', () => {
  verifyRolesRules(CourtSessionController, 'create', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
