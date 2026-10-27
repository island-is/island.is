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
import { AppealStatementController } from '../appealStatement.controller'

describe('AppealStatementController - Top-level guards', () => {
  verifyGuards(
    AppealStatementController,
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

// The court of appeals alone files on a party's behalf. The route is a write
// on the case, so getting this wrong would let a party mark its own statement
// as filed without filing one.
describe('AppealStatementController - fileStatement roles', () => {
  verifyRolesRules(AppealStatementController, 'fileStatement', [
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})
