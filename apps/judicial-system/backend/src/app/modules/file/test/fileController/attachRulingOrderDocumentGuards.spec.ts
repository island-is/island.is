import { RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Attach ruling order document guards', () => {
  verifyGuards(
    FileController,
    'attachRulingOrderDocument',
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
