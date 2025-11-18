import { CaseType } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'

describe('CaseController - Get custody notice pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCustodyNoticePdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, CaseCompletedGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY],
        },
      },
    ],
  )
})
