import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { LimitedAccessCreateDefendantCaseFileGuard } from '../../guards/limitedAccessCreateDefendantCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create defendant case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'createDefendantCaseFile',
    [
      CaseTypeGuard,
      CaseWriteGuard,
      DefendantExistsGuard,
      LimitedAccessCreateDefendantCaseFileGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})
