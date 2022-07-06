import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/common'
import { HttpModule, HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../../../environments'
import { NationalRegistryService } from '../../nationalRegistry.service'
import { NationalRegistryUser } from '../../nationalRegistry.types'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
  EinstaklingarApi,
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'

const user: NationalRegistryUser = {
  nationalId: '1306886513',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
}

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: ['@vegagerdin.is/air-discount-scheme-scope'],
  authorization: '',
  client: '',
}

describe('NationalRegistryService', () => {
  let nationalRegistryService: NationalRegistryService
  let einstaklingarApi: EinstaklingarApi
  let cacheManager: CacheManager

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
        NationalRegistryClientModule,
      ],
      providers: [
        NationalRegistryService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            error: () => ({}),
          })),
        },
      ],
    }).compile()

    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)

    einstaklingarApi = moduleRef.get<EinstaklingarApi>(EinstaklingarApi)
  })

  describe('getUser', () => {
    it('should return null if nationalRegistry throws an error', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(
        user.nationalId,
        auth,
      )

      expect(result).toEqual(null)
    })
  })
})
