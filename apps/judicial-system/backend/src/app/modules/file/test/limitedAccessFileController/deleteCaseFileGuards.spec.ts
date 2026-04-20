import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseCompletedGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessDeleteCaseFileGuard } from '../../guards/limitedAccessDeleteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Delete case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'deleteCaseFile',
    [
      CaseTypeGuard,
      CaseWriteGuard,
      CaseCompletedGuard,
      CaseFileExistsGuard,
      LimitedAccessDeleteCaseFileGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [
            ...restrictionCases,
            ...investigationCases,
            ...indictmentCases,
          ],
        },
      },
    ],
  )
})
