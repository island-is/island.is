import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

describe('LimitedAccessDefendantController - Top-level guards', () => {
  verifyGuards(LimitedAccessDefendantController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    CaseTypeGuard,
    CaseWriteGuard,
    DefendantExistsGuard,
  ]),
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }]
})
