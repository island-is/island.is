import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Top-level guards', () => {
  // CaseExistsGuard runs before RolesGuard so that case-dependent roles rules
  // (e.g. confirming a ruling order as the registered judge) can read the case.
  verifyGuards(FileController, undefined, [
    JwtAuthUserGuard,
    CaseExistsGuard,
    RolesGuard,
  ])
})
