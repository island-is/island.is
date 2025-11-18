import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all rules', () => {
  verifyRolesRules(CaseController, 'getAll', [defenderRule])
})
