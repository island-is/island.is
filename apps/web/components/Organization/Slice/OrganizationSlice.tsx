import React, { FC } from 'react'
import {
  Districts,
  FeaturedArticles,
  Organization,
  Slice,
} from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import {
  DistrictsSlice,
  FeaturedArticlesSlice,
  HeadingSlice,
  OfficesSlice,
  OneColumnTextSlice,
  TwoColumnTextSlice,
} from '@island.is/web/components'

interface OrganizationSliceProps {
  slice: Slice
  organization: Organization
  namespace?: Namespace
}

export const OrganizationSlice: FC<OrganizationSliceProps> = ({
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
    case 'OneColumnText':
      return <OneColumnTextSlice slice={slice} />
    default:
      return <></>
  }
}
