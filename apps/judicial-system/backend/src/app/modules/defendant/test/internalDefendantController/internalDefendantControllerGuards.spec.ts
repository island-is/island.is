import { TokenGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { InternalDefendantController } from '../../internalDefendant.controller'

// The exists guard is per route: the deliver routes read the case with the
// plain CaseExistsGuard and the update route under FOR UPDATE. The routes'
// own specs pin each one, and internalDefendantGuardChain.spec.ts runs them.
describe('InternalDefendantController - Top-level guards', () => {
  verifyGuards(InternalDefendantController, undefined, [TokenGuard])
})
