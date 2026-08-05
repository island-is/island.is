import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantExistsGuard } from '../../../defendant'
import { LimitedAccessCreateCivilClaimantCaseFileGuard } from '../../guards/limitedAccessCreateCivilClaimantCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create civil claimant case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'createCivilClaimantCaseFile',
    [
      CaseTypeGuard,
      CaseWriteGuard,
      CivilClaimantExistsGuard,
      LimitedAccessCreateCivilClaimantCaseFileGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})
