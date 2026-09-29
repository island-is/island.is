import { verifyGuards } from '../../../../test'
import { StatisticsController } from '../../statistics.controller'

// The route relies on the controller's guards alone.
describe('StatisticsController - Get statistics guards', () => {
  verifyGuards(StatisticsController, 'getStatistics', [])
})
