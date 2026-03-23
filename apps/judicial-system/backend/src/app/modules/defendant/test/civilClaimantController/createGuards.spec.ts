import { verifyGuards } from '../../../../test'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Create guards', () => {
  verifyGuards(CivilClaimantController, 'create', [])
})
