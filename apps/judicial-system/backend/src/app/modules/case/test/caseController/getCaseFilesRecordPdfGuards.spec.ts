import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { MergedCaseExistsGuard } from '../../guards/mergedCaseExists.guard'

describe('CaseController - Get case files record pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCaseFilesRecordPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, MergedCaseExistsGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
