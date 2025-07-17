import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../test'
import { CaseExistsGuard } from '../../case'
import { ValidateVerdictGuard } from '../guards/validateVerdict.guard'
import { VerdictWriteGuard } from '../guards/verdictWrite.guard'
import { VerdictController } from '../verdict.controller'

describe('VerdictController - Top-level guards', () => {
  verifyGuards(VerdictController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    ValidateVerdictGuard,
  ])
})

describe('VerdictController - Update', () => {
  verifyGuards(VerdictController, 'update', [VerdictWriteGuard])
})
