import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { investigationCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../test'
import {
  CaseTypeGuard,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
} from '../../case'
import { ValidateVictimGuard } from '../guards/validateVictim.guard'
import { VictimWriteGuard } from '../guards/victimWrite.guard'
import { VictimController } from '../victim.controller'

describe('VictimController - Top-level guards', () => {
  verifyGuards(
    VictimController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      MinimalCaseExistsGuard,
      CaseTypeGuard,
      MinimalCaseAccessGuard,
      ValidateVictimGuard,
      VictimWriteGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: investigationCases } }],
  )
})

describe('VictimController - Create', () => {
  verifyGuards(VictimController, 'create', [])
})

describe('VictimController - Update', () => {
  verifyGuards(VictimController, 'update', [])
})

describe('VictimController - Delete', () => {
  verifyGuards(VictimController, 'delete', [])
})
