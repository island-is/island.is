import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../test'
import {
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
} from '../../case'
import { DefendantExistsGuard } from '../../defendant'
import { VerdictExistGuard } from '../guards/verdictExistGuard.guard'
import { VerdictController } from '../verdict.controller'

describe('VerdictController - Top-level guards', () => {
  verifyGuards(
    VerdictController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      CaseCompletedGuard,
      DefendantExistsGuard,
      VerdictExistGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: indictmentCases,
        },
      },
    ],
  )
})

describe('VerdictController - Update', () => {
  verifyGuards(VerdictController, 'update', [])
})
