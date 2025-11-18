import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Top-level guards', () => {
  verifyGuards(CaseController, undefined, [JwtAuthUserGuard, RolesGuard])
})
