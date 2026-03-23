import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'

describe('CourtDocumentController - File in Court Session Roles', () => {
  verifyRolesRules(CourtDocumentController, 'fileInCourtSession', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
