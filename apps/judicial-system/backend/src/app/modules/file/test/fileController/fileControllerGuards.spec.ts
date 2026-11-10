import { JwtAuthUserGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Top-level guards', () => {
  // Only authentication is declared on the class. CaseExistsGuard and
  // RolesGuard are declared on each route, in that order, so that a route can
  // choose how its case is loaded without changing the others.
  verifyGuards(FileController, undefined, [JwtAuthUserGuard])
})
