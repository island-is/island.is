import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../test'
import {
  CaseTypeGuard,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
} from '../../case'
import { IndictmentCountsController } from '../indictmentCounts.controller'

describe('IndictmentCountsController - Top-level guards', () => {
  verifyGuards(
    IndictmentCountsController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      MinimalCaseExistsGuard,
      CaseTypeGuard,
      MinimalCaseAccessGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('IndictmentCountsController - Reorder', () => {
  verifyGuards(IndictmentCountsController, 'reorder', [])
})
