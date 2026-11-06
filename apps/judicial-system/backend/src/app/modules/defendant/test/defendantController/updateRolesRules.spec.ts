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
import {
  courtOfAppealsAssistantUpdateDefendantRule,
  courtOfAppealsJudgeUpdateDefendantRule,
  courtOfAppealsRegistrarUpdateDefendantRule,
} from '../../guards/rolesRules'

describe('DefendantController - Update rules', () => {
  verifyRolesRules(DefendantController, 'update', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
    // Field rules, unlike the rest - what they are limited to is asserted in
    // appealAdvocateRolesRules.spec.ts.
    courtOfAppealsJudgeUpdateDefendantRule,
    courtOfAppealsRegistrarUpdateDefendantRule,
    courtOfAppealsAssistantUpdateDefendantRule,
  ])
})
