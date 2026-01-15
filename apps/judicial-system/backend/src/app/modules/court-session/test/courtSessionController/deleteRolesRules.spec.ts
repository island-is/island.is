import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Delete Roles', () => {
  verifyRolesRules(CourtSessionController, 'delete', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
