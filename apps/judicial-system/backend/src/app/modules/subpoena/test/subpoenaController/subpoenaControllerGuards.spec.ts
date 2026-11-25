import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
} from '../../../case'
import {
  DefendantExistsGuard,
  SplitDefendantExistsGuard,
} from '../../../defendant'
import {
  SubpoenaExistsGuard,
  SubpoenaExistsOptionalGuard,
} from '../../guards/subpoenaExists.guard'
import { SubpoenaController } from '../../subpoena.controller'

const indictmentCaseType = [
  { guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } },
]

// The exists guard sits on each route rather than on the class: the one
// mutating route locks the case row, and the three that do not must not. The
// declared order is pinned here; subpoenaGuardChain.spec.ts runs it.
describe('SubpoenaController - Top-level guards', () => {
  verifyGuards(SubpoenaController, undefined, [JwtAuthUserGuard, RolesGuard])
})

describe('SubpoenaController - createSubpoenas guards', () => {
  verifyGuards(
    SubpoenaController,
    'createSubpoenas',
    [CaseExistsForUpdateGuard, CaseTypeGuard, CaseReadGuard],
    indictmentCaseType,
  )
})

// Calls the police inside a transaction of its own: no lock.
describe('SubpoenaController - getSubpoena guards', () => {
  verifyGuards(
    SubpoenaController,
    'getSubpoena',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      DefendantExistsGuard,
      SubpoenaExistsGuard,
    ],
    indictmentCaseType,
  )
})

// A read: no lock.
describe('SubpoenaController - getSubpoenaPdf guards', () => {
  verifyGuards(
    SubpoenaController,
    'getSubpoenaPdf',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      SplitDefendantExistsGuard,
      SubpoenaExistsOptionalGuard,
    ],
    indictmentCaseType,
  )
})

// A read: no lock.
describe('SubpoenaController - getServiceCertificatePdf guards', () => {
  verifyGuards(
    SubpoenaController,
    'getServiceCertificatePdf',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      SplitDefendantExistsGuard,
      SubpoenaExistsGuard,
    ],
    indictmentCaseType,
  )
})
