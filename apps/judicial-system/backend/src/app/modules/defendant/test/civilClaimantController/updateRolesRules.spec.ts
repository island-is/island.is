import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CivilClaimantController } from '../../civilClaimant.controller'
import {
  courtOfAppealsAssistantUpdateCivilClaimantRule,
  courtOfAppealsJudgeUpdateCivilClaimantRule,
  courtOfAppealsRegistrarUpdateCivilClaimantRule,
} from '../../guards/rolesRules'

describe('CivilClaimantController - Update rules', () => {
  verifyRolesRules(CivilClaimantController, 'update', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    // Field rules, unlike the rest - what they are limited to is asserted in
    // appealAdvocateRolesRules.spec.ts.
    courtOfAppealsJudgeUpdateCivilClaimantRule,
    courtOfAppealsRegistrarUpdateCivilClaimantRule,
    courtOfAppealsAssistantUpdateCivilClaimantRule,
  ])
})
