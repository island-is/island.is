import { RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Confirm ruling order guards', () => {
  // CaseExistsGuard runs before RolesGuard so that the case-dependent roles
  // rule (confirming a ruling order as the registered judge) can read the case.
  verifyGuards(
    FileController,
    'confirmRulingOrder',
    [
      CaseExistsGuard,
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
