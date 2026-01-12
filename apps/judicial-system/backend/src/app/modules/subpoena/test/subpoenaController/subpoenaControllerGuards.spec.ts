import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../../case'
import {
  DefendantExistsGuard,
  SplitDefendantExistsGuard,
} from '../../../defendant'
import { SubpoenaExistsGuard } from '../../guards/subpoenaExists.guard'
import { SubpoenaController } from '../../subpoena.controller'

describe('SubpoenaController - Top-level guards', () => {
  verifyGuards(
    SubpoenaController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('SubpoenaController - getSubpoena guards', () => {
  verifyGuards(SubpoenaController, 'getSubpoena', [
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  ])
})

describe('SubpoenaController - getSubpoenaPdf guards', () => {
  verifyGuards(SubpoenaController, 'getSubpoenaPdf', [
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  ])
})

describe('SubpoenaController - getServiceCertificatePdf guards', () => {
  verifyGuards(SubpoenaController, 'getServiceCertificatePdf', [
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  ])
})
