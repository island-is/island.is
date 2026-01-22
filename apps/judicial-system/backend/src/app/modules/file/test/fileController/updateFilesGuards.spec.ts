import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseNotCompletedGuard, CaseWriteGuard } from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'

describe('FileController - Upload case file to court guards', () => {
  verifyGuards(
    FileController,
    'updateFiles',
    [CaseTypeGuard, CaseWriteGuard, CaseNotCompletedGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
