import { Test } from '@nestjs/testing'
import { AssetsXRoadService } from './api-domains-assets.service'
import {
  MOCK_ASSET_ID,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'

startMocking(requestHandlers)
describe('AssetsXRoadService', () => {
  let service: AssetsXRoadService

  beforeEach(async () => {
    const module = await Test.createTestingModule({}).compile()

    service = module.get(AssetsXRoadService)
  })

  describe('getRealEstates', () => {
    it('User should see information on owned property', async () => {
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
      const response = await service.getRealEstateDetail(MOCK_ASSET_ID, MOCK_USER)
      expect(response).toBeNull()
    })
  })
})
