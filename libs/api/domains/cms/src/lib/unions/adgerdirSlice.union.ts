import { createUnionType } from '@nestjs/graphql'
import { AdgerdirFeaturedNewsSlice } from '../models/adgerdirFeaturedNewsSlice.model'
import { AdgerdirGroupSlice } from '../models/adgerdirGroupSlice.model'

export const AdgerdirSliceUnion = createUnionType({
  name: 'AdgerdirSlice',
  types: () => [AdgerdirGroupSlice, AdgerdirFeaturedNewsSlice],
})
