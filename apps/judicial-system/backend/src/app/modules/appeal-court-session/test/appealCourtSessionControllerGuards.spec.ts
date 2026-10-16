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
import { AppealCourtSessionController } from '../appealCourtSession.controller'
import { AppealCourtSessionExistsGuard } from '../guards/appealCourtSessionExists.guard'

const courtOfAppealsRules = [
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  courtOfAppealsAssistantRule,
]

describe('AppealCourtSessionController - Top-level guards', () => {
  verifyGuards(
    AppealCourtSessionController,
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

describe('AppealCourtSessionController - update guards', () => {
  verifyGuards(AppealCourtSessionController, 'update', [
    AppealCourtSessionExistsGuard,
  ])
})

describe('AppealCourtSessionController - delete guards', () => {
  verifyGuards(AppealCourtSessionController, 'delete', [
    AppealCourtSessionExistsGuard,
  ])
})

describe('AppealCourtSessionController - create roles', () => {
  verifyRolesRules(AppealCourtSessionController, 'create', courtOfAppealsRules)
})

describe('AppealCourtSessionController - update roles', () => {
  verifyRolesRules(AppealCourtSessionController, 'update', courtOfAppealsRules)
})

describe('AppealCourtSessionController - delete roles', () => {
  verifyRolesRules(AppealCourtSessionController, 'delete', courtOfAppealsRules)
})
