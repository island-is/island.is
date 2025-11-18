import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsRegistrarTransitionRule,
  districtCourtAssistantTransitionRule,
  districtCourtJudgeTransitionRule,
  districtCourtRegistrarTransitionRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorTransitionRule,
} from '../../guards/rolesRules'

describe('CaseController - Transition rules', () => {
  verifyRolesRules(CaseController, 'transition', [
    prosecutorTransitionRule,
    prosecutorRepresentativeTransitionRule,
    districtCourtJudgeTransitionRule,
    districtCourtRegistrarTransitionRule,
    districtCourtAssistantTransitionRule,
    courtOfAppealsJudgeTransitionRule,
    courtOfAppealsRegistrarTransitionRule,
    courtOfAppealsAssistantTransitionRule,
  ])
})
