import { Test, TestingModule } from '@nestjs/testing'
import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'
import { StepsController } from './steps.controller'
import { StepsModule } from './steps.module'
import { StepsService } from './steps.service'
import { Step } from './models/step.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

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
