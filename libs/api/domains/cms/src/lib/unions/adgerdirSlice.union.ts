import { createUnionType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  IVidspyrnaFeaturedNews,
  IVidspyrnaFlokkur,
} from '../generated/contentfulTypes'
import {
  AdgerdirFeaturedNewsSlice,
  mapAdgerdirFeaturedNewsSlice,
} from '../models/adgerdirFeaturedNewsSlice.model'
import {
  AdgerdirGroupSlice,
  mapAdgerdirGroupSlice,
} from '../models/adgerdirGroupSlice.model'

export const AdgerdirSliceUnion = createUnionType({
  name: 'AdgerdirSlice',
  types: () => [AdgerdirGroupSlice, AdgerdirFeaturedNewsSlice],
})

type AdgerdirSliceTypes = IVidspyrnaFeaturedNews | IVidspyrnaFlokkur

export const mapAdgerdirSliceUnion = (
  slice: AdgerdirSliceTypes,
): typeof AdgerdirSliceUnion => {
  const id = slice?.sys?.contentType?.sys?.id ?? ''

  switch (id) {
    case 'vidspyrnaFeaturedNews':
      return mapAdgerdirFeaturedNewsSlice(slice as IVidspyrnaFeaturedNews)

    case 'vidspyrnaFlokkur':
      return mapAdgerdirGroupSlice(slice as IVidspyrnaFlokkur)

    default:
      throw new ApolloError(
        `Can not convert to slice in mapAdgerdirFrontpage -> mapAdgerdirSlice`,
      )
  }
}
