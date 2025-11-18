import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Create rules', () => {
  verifyRolesRules(CaseController, 'create', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})
