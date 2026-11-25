import { TokenGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
} from '../../case'
import { AppealVerdictExistsGuard } from '../guards/appealVerdictExists.guard'
import { AppealVerdictOnCaseGuard } from '../guards/appealVerdictOnCase.guard'
import { ExternalPoliceAppealVerdictExistsGuard } from '../guards/externalPoliceAppealVerdictExists.guard'
import { InternalAppealVerdictController } from '../internalAppealVerdict.controller'

describe('InternalAppealVerdictController - Top-level guards', () => {
  verifyGuards(InternalAppealVerdictController, undefined, [TokenGuard])
})

describe('InternalAppealVerdictController - deliverAppealVerdictToNationalCommissionersOffice', () => {
  verifyGuards(
    InternalAppealVerdictController,
    'deliverAppealVerdictToNationalCommissionersOffice',
    [CaseExistsGuard, CaseTypeGuard, AppealVerdictExistsGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

// The appeal-verdict lookup supplies the case id the locking read needs, so
// it stays first; the verdict is then re-taken from the locked case.
describe('InternalAppealVerdictController - updateAppealVerdict', () => {
  verifyGuards(InternalAppealVerdictController, 'updateAppealVerdict', [
    ExternalPoliceAppealVerdictExistsGuard,
    CaseExistsForUpdateGuard,
    AppealVerdictOnCaseGuard,
  ])
})
