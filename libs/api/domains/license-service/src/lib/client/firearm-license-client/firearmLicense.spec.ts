import {
  FirearmLicenseClientConfig,
  FirearmLicenseClientModule,
} from '@island.is/clients/firearm-license'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { GenericFirearmLicenseApi } from './firearmLicenseService.api'

describe('GenericFirearmLicenseService', () => {
  let service: GenericFirearmLicenseApi

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        FirearmLicenseClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [FirearmLicenseClientConfig],
        }),
      ],
      providers: [
        GenericFirearmLicenseApi,
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            warn: () => undefined,
          },
        },
      ],
    }).compile()

    service = module.get(GenericFirearmLicenseApi)
  })

  //Just the absolute basiscs, add to later

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })
})
