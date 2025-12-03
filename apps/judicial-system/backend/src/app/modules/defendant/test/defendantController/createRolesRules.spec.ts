import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Create rules', () => {
  verifyRolesRules(DefendantController, 'create', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})
