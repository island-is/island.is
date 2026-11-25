import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../test'
import { AppealCaseExistsGuard } from '../../appeal-case/guards/appealCaseExists.guard'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../case'
import { AppealStatementDeadlineController } from '../appealStatementDeadline.controller'

describe('AppealStatementDeadlineController - Top-level guards', () => {
  verifyGuards(
    AppealStatementDeadlineController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      AppealCaseExistsGuard,
      CaseWriteGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

// The court of appeals alone gives deadlines. The route is a write on the
// case, so getting this wrong would let a party move its own deadline.
describe('AppealStatementDeadlineController - set roles', () => {
  verifyRolesRules(AppealStatementDeadlineController, 'set', [
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})
