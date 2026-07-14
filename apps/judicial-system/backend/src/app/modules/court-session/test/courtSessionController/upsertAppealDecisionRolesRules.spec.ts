import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Upsert appeal decision Roles', () => {
  verifyRolesRules(CourtSessionController, 'upsertAppealDecision', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
