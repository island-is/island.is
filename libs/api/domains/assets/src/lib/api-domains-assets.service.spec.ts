import { Test } from '@nestjs/testing'
import { AssetsXRoadService } from './api-domains-assets.service'
import { PROPERTY_OWNED } from '@island.is/api/mocks'

import { defineConfig, ConfigModule } from '@island.is/nest/config'

describe('getRealEstateAddress', () => {
  const service: AssetsXRoadService = Test.createTestingModule()

  it('details has address', async () => {
    //
  })

  it('unitsOfUse is nullish if user is not owner', async () => {
    //
  })

  it('unitsOfUse is valid if user is owner', async () => {
    //
  })

  it('not found for invalid propertyNumber', async () => {
    //
  })
})
