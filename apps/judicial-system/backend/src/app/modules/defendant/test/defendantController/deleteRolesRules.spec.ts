import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Delete rules', () => {
  verifyRolesRules(DefendantController, 'delete', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})
