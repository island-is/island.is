import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Pronounce ruling orally Roles', () => {
  verifyRolesRules(CourtSessionController, 'pronounceRulingOrally', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
