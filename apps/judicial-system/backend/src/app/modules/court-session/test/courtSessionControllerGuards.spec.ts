import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../test'
import { CourtSessionController } from '../courtSession.controller'

describe('CourtSessionController - Top-level guards', () => {
  verifyGuards(CourtSessionController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
  ])
})
