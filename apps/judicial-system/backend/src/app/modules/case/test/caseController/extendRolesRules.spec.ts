import { prosecutorRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Extend rules', () => {
  verifyRolesRules(CaseController, 'extend', [prosecutorRule])
})
