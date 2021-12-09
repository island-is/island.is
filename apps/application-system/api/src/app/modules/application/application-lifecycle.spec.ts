import { Test } from '@nestjs/testing'
import { ApplicationLifeCycleService } from './application-lifecycle.service'

describe('PublicFlightController', () => {
  let lifeCycleService: ApplicationLifeCycleService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ApplicationLifeCycleService],
    }).compile()

    lifeCycleService = moduleRef.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })
})
