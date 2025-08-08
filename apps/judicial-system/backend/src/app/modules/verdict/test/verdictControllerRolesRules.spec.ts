import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  publicProsecutorStaffRule,
} from '../../../guards'
import { verifyRolesRules } from '../../../test'
import { VerdictController } from '../verdict.controller'

describe('VerdictController - Update Roles', () => {
  verifyRolesRules(VerdictController, 'update', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  ])
})
