import { adminRule, localAdminRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

describe('StatisticsController - Get statistics rules', () => {
  verifyRolesRules(StatisticsController, 'getStatistics', [
    adminRule,
    localAdminRule,
  ])
})
