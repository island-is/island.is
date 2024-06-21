import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { StepsController } from './steps.controller'
import { StepsModule } from './steps.module'

describe('StepsController', () => {
  let controller: StepsController
  let app: TestApp

  beforeEach(async () => {
    app = await testServer({
      appModule: StepsModule,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
    controller = app.get(StepsController)
  })

  it('should run', () => {
    expect(true).toBeTruthy
  })
})
