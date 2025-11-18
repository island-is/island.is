import { publicProsecutorStaffRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get ruling sent to prison admin pdf rules', () => {
  verifyRolesRules(CaseController, 'getRulingSentToPrisonAdminPdf', [
    publicProsecutorStaffRule,
  ])
})
