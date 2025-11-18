import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get case files record pdf rules', () => {
  verifyRolesRules(CaseController, 'getCaseFilesRecordPdf', [
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
