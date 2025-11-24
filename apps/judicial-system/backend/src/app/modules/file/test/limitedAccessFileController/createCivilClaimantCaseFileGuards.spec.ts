import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantExistsGuard } from '../../../defendant'
import { CreateCivilClaimantCaseFileGuard } from '../../guards/createCivilClaimantCaseFile.guard'
import { LimitedAccessWriteCaseFileGuard } from '../../guards/limitedAccessWriteCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create civil claimant case file guards', () => {
  verifyGuards(
    LimitedAccessFileController,
    'createCivilClaimantCaseFile',
    [
      CaseTypeGuard,
      CaseWriteGuard,
      CivilClaimantExistsGuard,
      LimitedAccessWriteCaseFileGuard,
      CreateCivilClaimantCaseFileGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})
