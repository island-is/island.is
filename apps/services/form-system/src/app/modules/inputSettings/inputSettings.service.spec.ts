import { Test, TestingModule } from '@nestjs/testing'
import { InputSettingsService } from './inputSettings.service'

describe('InputSettingsService', () => {
  let service: InputSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InputSettingsService],
    }).compile()

    service = module.get<InputSettingsService>(InputSettingsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
