import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseCompletedGuard,
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { VerdictExistsGuard } from '../../guards/verdictExists.guard'
import { VerdictController } from '../../verdict.controller'

const indictmentCaseType = [
  { guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } },
]

// The exists guard sits on each route rather than on the class: the three
// mutating routes lock the case row, and the two that do not must not. The
// declared order is pinned here; verdictGuardChain.spec.ts runs it.
describe('VerdictController - Top-level guards', () => {
  verifyGuards(VerdictController, undefined, [JwtAuthUserGuard, RolesGuard])
})

describe('VerdictController - Create verdicts', () => {
  verifyGuards(
    VerdictController,
    'createVerdicts',
    [CaseExistsForUpdateGuard, CaseTypeGuard, CaseWriteGuard],
    indictmentCaseType,
  )
})

describe('VerdictController - Update', () => {
  verifyGuards(
    VerdictController,
    'update',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      DefendantExistsGuard,
      VerdictExistsGuard,
      CaseCompletedGuard,
    ],
    indictmentCaseType,
  )
})

// A read: no lock.
describe('VerdictController - getServiceCertificatePdf', () => {
  verifyGuards(
    VerdictController,
    'getServiceCertificatePdf',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      DefendantExistsGuard,
      VerdictExistsGuard,
      CaseCompletedGuard,
    ],
    indictmentCaseType,
  )
})

// Calls the police inside a transaction of its own: no lock.
describe('VerdictController - getVerdict', () => {
  verifyGuards(
    VerdictController,
    'getVerdict',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      DefendantExistsGuard,
      VerdictExistsGuard,
      CaseCompletedGuard,
    ],
    indictmentCaseType,
  )
})

describe('VerdictController - deliverCaseVerdict', () => {
  verifyGuards(
    VerdictController,
    'deliverCaseVerdict',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseCompletedGuard,
    ],
    indictmentCaseType,
  )
})
