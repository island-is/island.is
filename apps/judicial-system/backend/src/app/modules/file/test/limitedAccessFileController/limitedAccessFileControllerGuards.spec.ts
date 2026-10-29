import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

// The case-exists guard is declared per route, since the three routes that
// create a file lock the case row and the others keep the plain read - see
// the per-route *Guards.spec.ts and limitedAccessFileGuardChain.spec.ts.
describe('LimitedAccessFileController - Top-level guards', () => {
  verifyGuards(LimitedAccessFileController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
  ])
})
