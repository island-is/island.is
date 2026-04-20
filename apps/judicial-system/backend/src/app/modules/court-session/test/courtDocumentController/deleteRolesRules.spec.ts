import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'

describe('CourtDocumentController - Delete Roles', () => {
  verifyRolesRules(CourtDocumentController, 'delete', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})
