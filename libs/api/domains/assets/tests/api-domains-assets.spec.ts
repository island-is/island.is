import { Test } from '@nestjs/testing'
import {
  MOCK_ASSET_ID,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { AssetsModule } from '../src/lib/api-domains-assets.module'
import { AssetsXRoadResolver } from '../src/lib/api-domains-assets.resolver'
import { AssetsXRoadService } from '../src/lib/api-domains-assets.service'
import { Logger, LOGGER_PROVIDER, LoggingModule } from '@island.is/logging'
import {
  AssetsClientModule,
  AssetsClientConfig,
  FasteignirApi,
} from '@island.is/clients/assets'

startMocking(requestHandlers)
describe('AssetsXRoadService', () => {
  let service: any

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AssetsXRoadService,
        { provide: FasteignirApi, useValue: {} },
        { provide: 'Logger', useValue: {} },
      ],
    }).compile()
    expect(module.get(AssetsXRoadService)).toBeInstanceOf(AssetsXRoadService)
  })

  describe.only('getRealEstates', () => {
    it.only('User should see information on owned property', async () => {
      const response = await service.getRealEstates(MOCK_USER)
      expect(response).toMatchObject({
        name: 'Valid Jónsson',
        issued: new Date('2021-05-25T06:43:15.327Z'),
        expires: new Date('2036-05-25T06:43:15.327Z'),
      })
    })

    it('User with no asset should see no assets', async () => {
      const response = await service.getRealEstates(MOCK_USER)
      expect(response).toBeNull()
    })
  })

  describe('getRealEstateDetail', () => {
    it('User should only see public information', async () => {
      const response = await service.getRealEstateDetail(
        MOCK_ASSET_ID,
        MOCK_USER,
      )
      expect(response).toBeNull()
    })
  })
})
