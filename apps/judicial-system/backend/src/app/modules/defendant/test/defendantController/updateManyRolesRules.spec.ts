import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { DefendantController } from '../../defendant.controller'
import { publicProsecutionProsecutorUpdateDefendantsRule } from '../../guards/rolesRules'

describe('DefendantController - Update many rules', () => {
  verifyRolesRules(DefendantController, 'updateMany', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
    publicProsecutionProsecutorUpdateDefendantsRule,
  ])
})
