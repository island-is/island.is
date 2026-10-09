import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseTypeGuard } from '../../../case'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

// A deliver route calls the court system with no transaction, so it reads
// the case with the plain CaseExistsGuard - never under FOR UPDATE.
describe('InternalDefendantController - Deliver defendant to court guards', () => {
  verifyGuards(
    InternalDefendantController,
    'deliverDefendantToCourt',
    [CaseExistsGuard, CaseTypeGuard, DefendantExistsGuard],
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
