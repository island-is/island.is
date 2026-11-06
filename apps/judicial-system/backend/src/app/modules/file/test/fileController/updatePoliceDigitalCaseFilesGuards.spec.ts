import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards, verifyInterceptors } from '../../../../test'
import {
  CaseOriginalAncestorInterceptor,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Update police digital case files guards', () => {
  verifyGuards(
    FileController,
    'updatePoliceDigitalCaseFiles',
    [CaseTypeGuard, CaseWriteGuard],
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
