import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { SmsService } from './sms.service'

describe('SmsService', () => {
  let service: SmsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: mock<Logger>(),
        },
        {
          provide: 'SMS_OPTIONS',
          useValue: {},
        },
        SmsService,
      ],
    }).compile()

    service = module.get<SmsService>(SmsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
