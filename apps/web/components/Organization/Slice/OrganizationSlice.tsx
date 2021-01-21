import React, { FC } from 'react'
import {
  Districts,
  FeaturedArticles,
  HeadingSlice as HeadingSliceSchema,
  Organization,
} from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import DistrictsSlice from '@island.is/web/components/Organization/Slice/Districts/DistrictsSlice'
import HeadingSlice from '@island.is/web/components/Organization/Slice/Heading/HeadingSlice'
import FeaturedArticlesSlice from '@island.is/web/components/Organization/Slice/FeaturedArticles/FeaturedArticlesSlice'

type AvailableSlices = HeadingSliceSchema | Districts | FeaturedArticles

interface OrganizationSliceProps {
  slice: AvailableSlices
  organization: Organization
  namespace?: Namespace
}

const OrganizationSlice: FC<OrganizationSliceProps> = ({
  slice,
  organization,
  namespace,
}) => {
  switch (slice.__typename) {
    case 'HeadingSlice':
      return <HeadingSlice slice={slice} />
    case 'Districts':
      return <DistrictsSlice slice={slice} organization={organization} />
    case 'FeaturedArticles':
      return <FeaturedArticlesSlice slice={slice} namespace={namespace} />
    default:
      return
  }
}

export default OrganizationSlice
