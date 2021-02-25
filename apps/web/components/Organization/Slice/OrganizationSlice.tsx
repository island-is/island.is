import React, { FC } from 'react'
import { Slice, Namespace } from '@island.is/web/graphql/schema'
import type { DistrictsSlice as DistrictsSliceType } from '@island.is/web/components'
import type { FeaturedArticlesSlice as FeaturedArticlesSliceType } from '@island.is/web/components'
import type { HeadingSlice as HeadingSliceType } from '@island.is/web/components'
import type { OfficesSlice as OfficesSliceType } from '@island.is/web/components'
import type { OneColumnTextSlice as OneColumnTextSliceType } from '@island.is/web/components'
import type { TwoColumnTextSlice as TwoColumnTextSliceType } from '@island.is/web/components'
import dynamic from 'next/dynamic'

const DistrictsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.DistrictsSlice as any),
) as typeof DistrictsSliceType

const FeaturedArticlesSlice = dynamic(() =>
  import('@island.is/web/components').then(
    (mod) => mod.FeaturedArticlesSlice as any,
  ),
) as typeof FeaturedArticlesSliceType

const HeadingSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.HeadingSlice as any),
) as typeof HeadingSliceType

const OfficesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OfficesSlice as any),
) as typeof OfficesSliceType

const OneColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then(
    (mod) => mod.OneColumnTextSlice as any,
  ),
) as typeof OneColumnTextSliceType

const TwoColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then(
    (mod) => mod.TwoColumnTextSlice as any,
  ),
) as typeof TwoColumnTextSliceType

interface OrganizationSliceProps {
  slice: Slice
  namespace?: Namespace
}

export const OrganizationSlice: FC<OrganizationSliceProps> = ({
  slice,
  namespace,
}) => {
  switch (slice.__typename) {
    case 'HeadingSlice':
      return <HeadingSlice slice={slice} />
    case 'Districts':
      return <DistrictsSlice slice={slice} />
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
