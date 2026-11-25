import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseTypeGuard } from '../../../case'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Update many guards', () => {
  verifyGuards(
    DefendantController,
    'updateMany',
    [CaseTypeGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})
