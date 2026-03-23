import { verifyGuards } from '../../../../test'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

describe('LimitedAccessDefendantController - Update guards', () => {
  verifyGuards(LimitedAccessDefendantController, 'update', [])
})
