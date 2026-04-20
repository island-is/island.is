import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'

describe('CourtDocumentController - Create Roles', () => {
  verifyRolesRules(CourtDocumentController, 'create', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
