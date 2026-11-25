import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Reject case file rules', () => {
  verifyRolesRules(FileController, 'rejectCaseFile', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
