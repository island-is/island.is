import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Top-level guards', () => {
  verifyGuards(FileController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
  ])
})
