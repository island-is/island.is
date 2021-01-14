import { createUnionType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  IDistricts,
  IFeaturedArticles,
  ISectionHeading,
} from '../generated/contentfulTypes'

import { HeadingSlice, mapHeadingSlice } from '../models/headingSlice.model'
import { Districts, mapDistricts } from '../models/districts.model'
import {
  FeaturedArticles,
  mapFeaturedArticles,
} from '../models/featuredArticles.model'

export const OrganizationSliceUnion = createUnionType({
  name: 'OrganizationSlice',
  types: () => [HeadingSlice, Districts, FeaturedArticles],
  resolveType: (document) => document.typename,
})

type OrganizationSliceTypes = ISectionHeading | IDistricts | IFeaturedArticles

export const mapOrganizationSliceUnion = (
  slice: OrganizationSliceTypes,
): typeof OrganizationSliceUnion => {
  const id = slice?.sys?.contentType?.sys?.id ?? ''

  switch (id) {
    case 'districts':
      return mapDistricts(slice as IDistricts)

    case 'sectionHeading':
      return mapHeadingSlice(slice as ISectionHeading)

    case 'featuredArticles':
      return mapFeaturedArticles(slice as IFeaturedArticles)

    default:
      throw new ApolloError(
        `Can not convert to slice in mapOrganizationSliceUnion`,
      )
  }
}
