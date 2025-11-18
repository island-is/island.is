import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'
import {
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtAssistantUpdateRule,
  districtCourtJudgeUpdateRule,
  districtCourtRegistrarUpdateRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorUpdateRule,
  publicProsecutorStaffUpdateRule,
} from '../../guards/rolesRules'

describe('CaseController - Update rules', () => {
  verifyRolesRules(CaseController, 'update', [
    prosecutorUpdateRule,
    prosecutorRepresentativeUpdateRule,
    districtCourtJudgeUpdateRule,
    districtCourtRegistrarUpdateRule,
    districtCourtAssistantUpdateRule,
    courtOfAppealsJudgeUpdateRule,
    courtOfAppealsRegistrarUpdateRule,
    courtOfAppealsAssistantUpdateRule,
    publicProsecutorStaffUpdateRule,
  ])
})
