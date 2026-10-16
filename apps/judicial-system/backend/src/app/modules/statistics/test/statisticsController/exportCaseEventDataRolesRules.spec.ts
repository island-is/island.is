import { adminRule, localAdminRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

describe('StatisticsController - Export case event data rules', () => {
  verifyRolesRules(StatisticsController, 'exportCaseEventData', [
    adminRule,
    localAdminRule,
  ])
})
