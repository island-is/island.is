import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../test'
import { AppealCaseExistsGuard } from '../../appeal-case/guards/appealCaseExists.guard'
import { CaseExistsGuard, CaseTypeGuard, CaseWriteGuard } from '../../case'
import { AppealCourtSessionController } from '../appealCourtSession.controller'

describe('AppealCourtSessionController - Top-level guards', () => {
  verifyGuards(
    AppealCourtSessionController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      AppealCaseExistsGuard,
      CaseWriteGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('AppealCourtSessionController - create roles', () => {
  verifyRolesRules(AppealCourtSessionController, 'create', [
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})
