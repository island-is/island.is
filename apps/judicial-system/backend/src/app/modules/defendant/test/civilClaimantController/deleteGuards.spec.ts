import { verifyGuards } from '../../../../test'
import { CivilClaimantController } from '../../civilClaimant.controller'
import { CivilClaimantExistsGuard } from '../../guards/civilClaimantExists.guard'

describe('CivilClaimantController - Delete guards', () => {
  verifyGuards(CivilClaimantController, 'delete', [CivilClaimantExistsGuard])
})
