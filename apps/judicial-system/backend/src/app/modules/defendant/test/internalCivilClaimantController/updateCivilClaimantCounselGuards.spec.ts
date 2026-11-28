import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseTypeGuard } from '../../../case'
import { CivilClaimantNationalIdExistsGuard } from '../../guards/civilClaimantNationalIdExists.guard'
import { InternalCivilClaimantController } from '../../internalCivilClaimant.controller'

describe('InternalCivilClaimantController - Update civil claimant counsel guards', () => {
  verifyGuards(
    InternalCivilClaimantController,
    'updateCivilClaimantCounsel',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CivilClaimantNationalIdExistsGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})
