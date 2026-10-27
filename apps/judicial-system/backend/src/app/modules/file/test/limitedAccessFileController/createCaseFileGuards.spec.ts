import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseTypeGuard,
  CaseWriteGuard,
  LimitedAccessCaseExistsForUpdateGuard,
} from '../../../case'
import { LimitedAccessCreateCaseFileGuard } from '../../guards/limitedAccessCreateCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'createCaseFile',
    [
      LimitedAccessCaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      LimitedAccessCreateCaseFileGuard,
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
