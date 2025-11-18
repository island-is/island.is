import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Get ruling signature confirmation guards', () => {
  verifyGuards(
    CaseController,
    'getRulingSignatureConfirmation',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [...restrictionCases, ...investigationCases],
        },
      },
    ],
  )
})
