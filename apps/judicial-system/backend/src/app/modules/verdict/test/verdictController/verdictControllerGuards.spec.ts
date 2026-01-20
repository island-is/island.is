import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseReadGuard,
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
    [JwtAuthUserGuard, RolesGuard, CaseExistsGuard, CaseTypeGuard],
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

describe('VerdictController - Create verdicts', () => {
  verifyGuards(VerdictController, 'createVerdicts', [CaseWriteGuard])
})

describe('VerdictController - Update', () => {
  verifyGuards(VerdictController, 'update', [
    CaseWriteGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  ])
})

describe('VerdictController - getServiceCertificatePdf', () => {
  verifyGuards(VerdictController, 'getServiceCertificatePdf', [
    CaseReadGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  ])
})

describe('VerdictController - getVerdict', () => {
  verifyGuards(VerdictController, 'getVerdict', [
    CaseReadGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  ])
})

describe('VerdictController - deliverCaseVerdict', () => {
  verifyGuards(VerdictController, 'deliverCaseVerdict', [
    CaseWriteGuard,
    CaseCompletedGuard,
  ])
})
