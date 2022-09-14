import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { SmartSolutionsApi } from './smartSolutions.api'
import { SmartSolutionsClientConfig } from './smartsolutionsApi.config'

describe('SmartSolutionsApi', () => {
  let service: SmartSolutionsApi

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [SmartSolutionsClientConfig],
        }),
      ],
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        SmartSolutionsApi,
      ],
    }).compile()

    service = module.get(SmartSolutionsApi)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })
})
