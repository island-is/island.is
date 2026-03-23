import {
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
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'
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
      LimitedAccessWriteCaseFileGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [...restrictionCases, ...investigationCases],
        },
      },
    ],
  )
})
