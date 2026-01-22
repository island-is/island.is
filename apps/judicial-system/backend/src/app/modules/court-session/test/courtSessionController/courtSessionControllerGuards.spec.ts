import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseTypeGuard, CaseWriteGuard } from '../../../case'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Top-level guards', () => {
  verifyGuards(
    CourtSessionController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseWriteGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
