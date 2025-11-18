import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'

describe('CaseController - Get ruling sent to prison admin pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRulingSentToPrisonAdminPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
