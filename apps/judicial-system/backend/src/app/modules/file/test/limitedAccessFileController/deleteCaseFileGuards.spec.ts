import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { DeleteAppealCaseFileGuard } from '../../guards/deleteAppealCaseFile.guard'
import { LimitedAccessDeleteCaseFileGuard } from '../../guards/limitedAccessDeleteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Delete case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'deleteCaseFile',
    [
      CaseTypeGuard,
      CaseWriteGuard,
      CaseFileExistsGuard,
      LimitedAccessDeleteCaseFileGuard,
      DeleteAppealCaseFileGuard,
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
