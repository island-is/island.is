import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

// limitedAccessDefendantGuardChain.spec.ts runs the chain.
describe('LimitedAccessDefendantController - Top-level guards', () => {
  verifyGuards(
    LimitedAccessDefendantController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      DefendantExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
