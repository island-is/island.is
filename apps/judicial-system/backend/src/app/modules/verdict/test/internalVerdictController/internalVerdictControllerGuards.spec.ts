import { TokenGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseCompletedGuard,
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
} from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { DefendantNationalIdExistsGuard } from '../../../defendant/guards/defendantNationalIdExists.guard'
import { ExternalPoliceVerdictExistsGuard } from '../../guards/ExternalPoliceVerdictExists.guard'
import { VerdictExistsGuard } from '../../guards/verdictExists.guard'
import { VerdictOnCaseGuard } from '../../guards/verdictOnCase.guard'
import { InternalVerdictController } from '../../internalVerdict.controller'

describe('InternalVerdictController - Top-level guards', () => {
  verifyGuards(InternalVerdictController, undefined, [TokenGuard])
})

describe('InternalVerdictController - deliverVerdictToNationalCommissionersOffice', () => {
  verifyGuards(
    InternalVerdictController,
    'deliverVerdictToNationalCommissionersOffice',
    [
      CaseExistsGuard,
      CaseTypeGuard,
      CaseCompletedGuard,
      DefendantExistsGuard,
      VerdictExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

// The verdict lookup supplies the case id the locking read needs, so it
// stays first; the verdict is then re-taken from the locked case.
// verdictGuardChain.spec.ts runs the chain.
describe('InternalVerdictController - updateVerdict', () => {
  verifyGuards(InternalVerdictController, 'updateVerdict', [
    ExternalPoliceVerdictExistsGuard,
    CaseExistsForUpdateGuard,
    VerdictOnCaseGuard,
  ])
})

describe('InternalVerdictController - updateVerdictAppeal', () => {
  verifyGuards(
    InternalVerdictController,
    'updateVerdictAppeal',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseCompletedGuard,
      DefendantNationalIdExistsGuard,
      VerdictExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('InternalVerdictController - getVerdictSupplements', () => {
  verifyGuards(InternalVerdictController, 'getVerdictSupplements', [
    ExternalPoliceVerdictExistsGuard,
  ])
})

describe('InternalVerdictController - deliverVerdictServiceCertificatesToPolice', () => {
  verifyGuards(
    InternalVerdictController,
    'deliverVerdictServiceCertificatesToPolice',
    [],
  )
})
