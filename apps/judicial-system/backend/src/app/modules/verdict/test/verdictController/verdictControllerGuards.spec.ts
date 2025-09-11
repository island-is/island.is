import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { VerdictExistsGuard } from '../../guards/verdictExists.guard'
import { VerdictController } from '../../verdict.controller'

describe('VerdictController - Top-level guards', () => {
  verifyGuards(
    VerdictController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseCompletedGuard,
      DefendantExistsGuard,
      VerdictExistsGuard,
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
