import { TokenGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { InternalCivilClaimantController } from '../../internalCivilClaimant.controller'

describe('InternalCivilClaimantController - Top-level guards', () => {
  verifyGuards(InternalCivilClaimantController, undefined, [TokenGuard])
})
