import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseTypeGuard,
  CaseWriteGuard,
  LimitedAccessCaseExistsGuard,
} from '../../../case'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create presigned post guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'createPresignedPost',
    [LimitedAccessCaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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
