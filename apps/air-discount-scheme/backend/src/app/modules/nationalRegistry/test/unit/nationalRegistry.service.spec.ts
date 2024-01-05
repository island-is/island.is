import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryService } from '../../nationalRegistry.service'
import { NationalRegistryUser } from '../../nationalRegistry.types'

import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
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
  scope: [AirDiscountSchemeScope.default],
  authorization: '',
  client: '',
}

describe('NationalRegistryService', () => {
  let nationalRegistryService: NationalRegistryService

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
