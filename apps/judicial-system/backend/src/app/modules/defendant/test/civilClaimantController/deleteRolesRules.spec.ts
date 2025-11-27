import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Delete rules', () => {
  verifyRolesRules(CivilClaimantController, 'delete', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})
