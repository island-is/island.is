import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../test'
import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../../case'
import { ValidateVictimGuard } from '../guards/validateVictim.guard'
import { VictimWriteGuard } from '../guards/victimWrite.guard'
import { VictimController } from '../victim.controller'

describe('VictimController - Top-level guards', () => {
  verifyGuards(VictimController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    ValidateVictimGuard,
  ])
})

describe('VictimController - Create', () => {
  verifyGuards(VictimController, 'create', [VictimWriteGuard])
})

describe('VictimController - Update', () => {
  verifyGuards(VictimController, 'update', [VictimWriteGuard])
})

describe('VictimController - Delete', () => {
  verifyGuards(VictimController, 'delete', [VictimWriteGuard])
})
