import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Confirm ruling order guards', () => {
  verifyGuards(
    FileController,
    'confirmRulingOrder',
    [CaseTypeGuard, CaseWriteGuard, CaseFileExistsGuard],
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
