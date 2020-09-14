import { createUnionType } from '@nestjs/graphql'

import { AdgerdirGroupSlice } from './adgerdirGroupSlice.model'
import { AdgerdirFeaturedNewsSlice } from './adgerdirFeaturedNewsSlice.model'

export const AdgerdirSlice = createUnionType({
  name: 'AdgerdirSlice',
  types: () => [AdgerdirGroupSlice, AdgerdirFeaturedNewsSlice],
})
