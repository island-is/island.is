import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../../case'
import { testGuards } from '../../case/guards/test/testHelper'
import { ValidateVictimGuard } from '../guards/validateVictim.guard'
import { VictimWriteGuard } from '../guards/victimWrite.guard'
import { VictimController } from '../victim.controller'

describe('VictimController - Top-level guards', () => {
  testGuards(VictimController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    ValidateVictimGuard,
  ])
})

describe('VictimController - Create', () => {
  testGuards(VictimController, 'create', [VictimWriteGuard])
})

describe('VictimController - Update', () => {
  testGuards(VictimController, 'update', [VictimWriteGuard])
})

describe('VictimController - Delete', () => {
  testGuards(VictimController, 'delete', [
    VictimWriteGuard,
    ValidateVictimGuard,
    MinimalCaseAccessGuard,
  ])
})
