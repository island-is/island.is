import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../../guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Transition guards', () => {
  verifyGuards(
    LimitedAccessCaseController,
    'transition',
    [
      JwtAuthUserGuard,
      RolesGuard,
      LimitedAccessCaseExistsGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseCompletedGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [...restrictionCases, ...investigationCases],
        },
      },
    ],
  )
})
