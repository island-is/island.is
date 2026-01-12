import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant/guards/defendantExists.guard'
import { SubpoenaExistsGuard } from '../../guards/subpoenaExists.guard'
import { LimitedAccessSubpoenaController } from '../../limitedAccessSubpoena.controller'

describe('LimitedAccessSubpoenaController - Top-level Guards', () => {
  verifyGuards(
    LimitedAccessSubpoenaController,
    undefined,
    [
      JwtAuthUserGuard,
      CaseExistsGuard,
      RolesGuard,
      CaseTypeGuard,
      CaseReadGuard,
      DefendantExistsGuard,
      SubpoenaExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('LimitedAccessSubpoenaController - Get subpoena PDF Guards', () => {
  verifyGuards(LimitedAccessSubpoenaController, 'getSubpoenaPdf', [])
})
