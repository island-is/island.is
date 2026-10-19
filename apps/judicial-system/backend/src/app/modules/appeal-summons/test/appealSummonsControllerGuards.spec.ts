import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../test'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
} from '../../case'
import { AppealSummonsController } from '../appealSummons.controller'
import { AppealSummonsExistsGuard } from '../guards/appealSummonsExists.guard'

const indictmentCaseType = [
  { guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } },
]

// The exists guard sits on each route rather than on the class: the four
// routes that change a summons lock the case row, and the three that do not
// must not. The declared order is pinned here; appealSummonsGuardChain.spec.ts
// runs it.
describe('AppealSummonsController - Top-level guards', () => {
  verifyGuards(AppealSummonsController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
  ])
})

describe('AppealSummonsController - create guards', () => {
  verifyGuards(
    AppealSummonsController,
    'create',
    [CaseExistsForUpdateGuard, CaseTypeGuard, CaseWriteGuard],
    indictmentCaseType,
  )
})

describe('AppealSummonsController - update guards', () => {
  verifyGuards(
    AppealSummonsController,
    'update',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      AppealSummonsExistsGuard,
    ],
    indictmentCaseType,
  )
})

describe('AppealSummonsController - delete guards', () => {
  verifyGuards(
    AppealSummonsController,
    'delete',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      AppealSummonsExistsGuard,
    ],
    indictmentCaseType,
  )
})

// Awaits an upload to S3 inside a transaction of its own: no lock. The read
// guard rather than the write guard, since confirmation is open to every
// prosecutor at the public prosecution office.
describe('AppealSummonsController - confirm guards', () => {
  verifyGuards(
    AppealSummonsController,
    'confirm',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, AppealSummonsExistsGuard],
    indictmentCaseType,
  )
})

describe('AppealSummonsController - sendToCourtOfAppeals guards', () => {
  verifyGuards(
    AppealSummonsController,
    'sendToCourtOfAppeals',
    [
      CaseExistsForUpdateGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      AppealSummonsExistsGuard,
    ],
    indictmentCaseType,
  )
})

// A read: no lock.
describe('AppealSummonsController - getPdf guards', () => {
  verifyGuards(
    AppealSummonsController,
    'getPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, AppealSummonsExistsGuard],
    indictmentCaseType,
  )
})

// A read: no lock.
describe('AppealSummonsController - preview guards', () => {
  verifyGuards(
    AppealSummonsController,
    'preview',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
    indictmentCaseType,
  )
})

describe('AppealSummonsController - create roles', () => {
  verifyRolesRules(AppealSummonsController, 'create', [
    publicProsecutorStaffRule,
  ])
})

describe('AppealSummonsController - update roles', () => {
  verifyRolesRules(AppealSummonsController, 'update', [
    publicProsecutorStaffRule,
  ])
})

describe('AppealSummonsController - delete roles', () => {
  verifyRolesRules(AppealSummonsController, 'delete', [
    publicProsecutorStaffRule,
  ])
})

describe('AppealSummonsController - confirm roles', () => {
  verifyRolesRules(AppealSummonsController, 'confirm', [prosecutorRule])
})

describe('AppealSummonsController - sendToCourtOfAppeals roles', () => {
  verifyRolesRules(AppealSummonsController, 'sendToCourtOfAppeals', [
    publicProsecutorStaffRule,
  ])
})

describe('AppealSummonsController - getPdf roles', () => {
  verifyRolesRules(AppealSummonsController, 'getPdf', [
    publicProsecutorStaffRule,
    prosecutorRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  ])
})

describe('AppealSummonsController - preview roles', () => {
  verifyRolesRules(AppealSummonsController, 'preview', [
    publicProsecutorStaffRule,
  ])
})
