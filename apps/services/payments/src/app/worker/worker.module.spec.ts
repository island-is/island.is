import { testServer, TestApp, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { DebtSettlementService } from '../debtPayment/debtSettlement.service'
import { RefundOrchestrationService } from '../refund/refundOrchestration.service'
import { WorkerModule } from './worker.module'
import { WorkerService } from './worker.service'

// The worker is its own entry point, so an app boot test does not cover its wiring
describe('WorkerModule', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await testServer({
      appModule: WorkerModule,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
  })

  afterAll(() => {
    app?.cleanUp()
  })

  it('wires up the worker with what it needs to settle and refund debt payments', () => {
    expect(app.get(WorkerService)).toBeInstanceOf(WorkerService)
    expect(app.get(DebtSettlementService)).toBeInstanceOf(DebtSettlementService)
    expect(app.get(RefundOrchestrationService)).toBeInstanceOf(
      RefundOrchestrationService,
    )
  })
})
