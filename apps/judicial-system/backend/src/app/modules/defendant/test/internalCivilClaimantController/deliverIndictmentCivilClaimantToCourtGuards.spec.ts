import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseTypeGuard } from '../../../case'
import { CivilClaimantExistsGuard } from '../../guards/civilClaimantExists.guard'
import { InternalCivilClaimantController } from '../../internalCivilClaimant.controller'

// CaseExistsGuard sits on the route rather than the class so the counsel
// PATCH can lock with CaseExistsForUpdateGuard instead. Deliver itself only
// needs a plain read.
describe('InternalCivilClaimantController - Deliver indictment civil claimant to court guards', () => {
  verifyGuards(
    InternalCivilClaimantController,
    'deliverIndictmentCivilClaimantToCourt',
    [CaseExistsGuard, CaseTypeGuard, CivilClaimantExistsGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})
