import { RolesGuard } from '@island.is/judicial-system/auth'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseNotCompletedGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'

describe('FileController - Upload case file to court guards', () => {
  verifyGuards(
    FileController,
    'updateFiles',
    [
      RolesGuard,
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseNotCompletedGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [
            ...indictmentCases,
            ...restrictionCases,
            ...investigationCases,
          ],
        },
      },
    ],
  )
})
