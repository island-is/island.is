import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Update rules', () => {
  verifyRolesRules(DefendantController, 'update', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  ])
})
