import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { AppealCaseController } from '../../appealCase.controller'

describe('AppealCaseController - Complete verdict appeals rules', () => {
  verifyRolesRules(AppealCaseController, 'completeVerdictAppeals', [
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})
