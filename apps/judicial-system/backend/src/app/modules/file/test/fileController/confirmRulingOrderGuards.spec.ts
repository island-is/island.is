import { RolesGuard, RouteRolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseWriteGuard } from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Confirm ruling order guards', () => {
  // RolesGuard runs after the locking read so that the case-dependent roles
  // rule (confirming a ruling order as the registered judge) can read the
  // case. RouteRolesGuard runs before it, so that only a district court judge
  // takes the lock.
  verifyGuards(
    FileController,
    'confirmRulingOrder',
    [
      RouteRolesGuard,
      CaseExistsForUpdateGuard,
      RolesGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseFileExistsGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: indictmentCases,
        },
      },
    ],
  )
})
