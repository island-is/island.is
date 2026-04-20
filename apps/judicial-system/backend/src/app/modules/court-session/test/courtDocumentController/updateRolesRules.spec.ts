import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'

describe('CourtDocumentController - Update Roles', () => {
  verifyRolesRules(CourtDocumentController, 'update', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
