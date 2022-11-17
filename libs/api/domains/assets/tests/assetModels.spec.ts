import { Test } from '@nestjs/testing'
import {
  MOCK_ASSET_ID,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { AssetsXRoadService } from '../src/lib/api-domains-assets.service'
import { FasteignirApi } from '@island.is/clients/assets'
import { MiddlewareContext } from '@nestjs/graphql'
import {
  PropertyDetail,
  isPropertyOwner,
} from '../src/models/propertyDetail.model'

describe('Asset Models', () => {
  describe.only('PropertyDetail model', () => {
    it('User should be only see public data if not owner', async () => {
      const property: PropertyDetail = {}
      const x = jest.mocked<MiddlewareContext>({ source: property }, true)
      expect(isPropertyOwner(x)).toBeTruthy()
    })
  })
})
