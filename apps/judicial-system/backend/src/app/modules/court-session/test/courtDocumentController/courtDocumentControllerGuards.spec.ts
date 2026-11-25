import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { CourtDocumentController } from '../../courtDocument.controller'

// The declared order. courtDocumentGuardChain.spec.ts runs it.
describe('CourtDocumentController - Top-level guards', () => {
  verifyGuards(
    CourtDocumentController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
