import { Test } from '@nestjs/testing'
import { StepsService } from './steps.service'

describe('StepsService', () => {
  let service: StepsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StepsService],
    }).compile()

    service = module.get<StepsService>(StepsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
