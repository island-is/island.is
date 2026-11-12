import { RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards, verifyInterceptors } from '../../../../test'
import {
  CaseExistsGuard,
  CaseOriginalAncestorInterceptor,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Update police digital case files guards', () => {
  verifyGuards(
    FileController,
    'updatePoliceDigitalCaseFiles',
    [CaseExistsGuard, RolesGuard, CaseTypeGuard, CaseWriteGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: indictmentCases,
        },
      },
    ],
  )

  verifyInterceptors(FileController, 'updatePoliceDigitalCaseFiles', [
    CaseOriginalAncestorInterceptor,
  ])
})
