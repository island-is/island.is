import React, { FC } from 'react'
import {
  Districts,
  FeaturedArticles,
  HeadingSlice as HeadingSliceSchema,
  Organization,
  Slice,
} from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import DistrictsSlice from '@island.is/web/components/Organization/Slice/Districts/DistrictsSlice'
import HeadingSlice from '@island.is/web/components/Organization/Slice/Heading/HeadingSlice'
import FeaturedArticlesSlice from '@island.is/web/components/Organization/Slice/FeaturedArticles/FeaturedArticlesSlice'
import TwoColumnTextSlice from '@island.is/web/components/Organization/Slice/TwoColumnText/TwoColumnTextSlice'
import OfficesSlice from '@island.is/web/components/Organization/Slice/Offices/OfficesSlice'
import SingleColumnTextSlice from '@island.is/web/components/Organization/Slice/SingleColumnText/SingleColumnTextSlice'

interface OrganizationSliceProps {
  slice: Slice
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
    case 'TwoColumnText':
      return <TwoColumnTextSlice slice={slice} />
    case 'Offices':
      return <OfficesSlice slice={slice} />
    case 'SingleColumnText':
      return <SingleColumnTextSlice slice={slice} />
    default:
      return <></>
  }
}

export default OrganizationSlice
