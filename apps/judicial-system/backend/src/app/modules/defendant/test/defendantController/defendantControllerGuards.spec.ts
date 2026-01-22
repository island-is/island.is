import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Top-level guards', () => {
  verifyGuards(DefendantController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})
