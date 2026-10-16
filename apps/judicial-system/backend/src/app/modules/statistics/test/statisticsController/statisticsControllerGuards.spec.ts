import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

describe('StatisticsController - Top-level guards', () => {
  verifyGuards(StatisticsController, undefined, [JwtAuthUserGuard, RolesGuard])
})
