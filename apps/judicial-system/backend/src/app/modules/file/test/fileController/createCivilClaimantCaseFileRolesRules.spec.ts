import {
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Create civil claimant case file rules', () => {
  verifyRolesRules(FileController, 'createCivilClaimantCaseFile', [
    publicProsecutorStaffRule,
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})
