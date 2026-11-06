import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseTypeGuard } from '../../../case'
import { DefendantNationalIdExistsGuard } from '../../guards/defendantNationalIdExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

// The update route changes a defendant from the case the guard loaded, so it
// reads the case under FOR UPDATE. internalDefendantGuardChain.spec.ts runs
// the chain.
describe('InternalDefendantController - Update defendant guards', () => {
  verifyGuards(
    InternalDefendantController,
    'updateDefendant',
    [CaseExistsForUpdateGuard, CaseTypeGuard, DefendantNationalIdExistsGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
