import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { LimitedAccessCaseExistsGuard } from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Top-level guards', () => {
  verifyGuards(LimitedAccessFileController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
  ])
})
