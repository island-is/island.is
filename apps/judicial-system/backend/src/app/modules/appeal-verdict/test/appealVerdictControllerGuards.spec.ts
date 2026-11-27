import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { publicProsecutorStaffRule } from '../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../case'
import { AppealVerdictController } from '../appealVerdict.controller'

const indictmentCaseType = [
  { guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } },
]

describe('AppealVerdictController - Top-level guards', () => {
  verifyGuards(AppealVerdictController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
  ])
})

// Mutating send locks the case row. Declared order is pinned here.
describe('AppealVerdictController - sendToService guards', () => {
  verifyGuards(
    AppealVerdictController,
    'sendToService',
    [CaseExistsForUpdateGuard, CaseTypeGuard, CaseWriteGuard],
    indictmentCaseType,
  )
})

describe('AppealVerdictController - sendToService roles', () => {
  verifyRolesRules(AppealVerdictController, 'sendToService', [
    publicProsecutorStaffRule,
  ])
})

// Sync opens its own transaction after LOKE polls: no case lock.
describe('AppealVerdictController - syncServiceStatuses guards', () => {
  verifyGuards(
    AppealVerdictController,
    'syncServiceStatuses',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
    indictmentCaseType,
  )
})

describe('AppealVerdictController - syncServiceStatuses roles', () => {
  verifyRolesRules(AppealVerdictController, 'syncServiceStatuses', [
    publicProsecutorStaffRule,
  ])
})
