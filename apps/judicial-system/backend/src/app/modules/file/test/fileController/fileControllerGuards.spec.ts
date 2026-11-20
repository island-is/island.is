import { JwtAuthUserGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Top-level guards', () => {
  // Only authentication is declared on the class. The case-exists guard and
  // RolesGuard are declared on each route, so that a route can choose how its
  // case is loaded without changing the others: the routes that create or
  // edit a file decide against a locked case row - they declare RolesGuard and
  // then CaseExistsForUpdateGuard, except confirming a ruling order, whose
  // roles rule needs the case and so follows the locking read, behind
  // RouteRolesGuard. The rest declare CaseExistsGuard and then RolesGuard.
  verifyGuards(FileController, undefined, [JwtAuthUserGuard])
})
