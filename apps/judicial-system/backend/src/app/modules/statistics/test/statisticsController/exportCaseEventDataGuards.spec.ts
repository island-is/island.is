import { verifyGuards } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

// The route relies on the controller's guards alone.
describe('StatisticsController - Export case event data guards', () => {
  verifyGuards(StatisticsController, 'exportCaseEventData', [])
})
