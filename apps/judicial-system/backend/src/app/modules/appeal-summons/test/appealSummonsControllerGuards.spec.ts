import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { publicProsecutorStaffRule } from '../../../guards'
import { verifyGuards, verifyRolesRules } from '../../../test'
import { CaseExistsGuard, CaseReadGuard, CaseTypeGuard } from '../../case'
import { AppealSummonsController } from '../appealSummons.controller'
import { AppealSummonsExistsGuard } from '../guards/appealSummonsExists.guard'

describe('AppealSummonsController - Top-level guards', () => {
  verifyGuards(
    AppealSummonsController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('AppealSummonsController - update guards', () => {
  verifyGuards(AppealSummonsController, 'update', [AppealSummonsExistsGuard])
})

describe('AppealSummonsController - getPdf guards', () => {
  verifyGuards(AppealSummonsController, 'getPdf', [AppealSummonsExistsGuard])
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

describe('AppealSummonsController - getPdf roles', () => {
  verifyRolesRules(AppealSummonsController, 'getPdf', [
    publicProsecutorStaffRule,
  ])
})

describe('AppealSummonsController - preview roles', () => {
  verifyRolesRules(AppealSummonsController, 'preview', [
    publicProsecutorStaffRule,
  ])
})
