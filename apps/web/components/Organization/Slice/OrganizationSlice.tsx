import React, { FC } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import dynamic from 'next/dynamic'

const DistrictsSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.DistrictsSlice),
)

const FeaturedArticlesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.FeaturedArticlesSlice),
)

const HeadingSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.HeadingSlice),
)

const OfficesSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OfficesSlice),
)

const OneColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.OneColumnTextSlice),
)

const TwoColumnTextSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.TwoColumnTextSlice),
)

const AccordionSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.AccordionSlice),
)

interface OrganizationSliceProps {
  slice: Slice
  organizationSlug: string
  namespace?: Namespace
}

export const OrganizationSlice: FC<OrganizationSliceProps> = ({
  slice,
  organizationSlug,
  namespace,
}) => {
  switch (slice.__typename) {
    case 'HeadingSlice':
      return <HeadingSlice slice={slice} />
    case 'Districts':
      return <DistrictsSlice slice={slice} />
    case 'FeaturedArticles':
      return (
        <FeaturedArticlesSlice
          slice={slice}
          namespace={namespace}
          organizationSlug={organizationSlug}
        />
      )
    case 'TwoColumnText':
      return <TwoColumnTextSlice slice={slice} />
    case 'Offices':
      return <OfficesSlice slice={slice} />
    case 'OneColumnText':
      return <OneColumnTextSlice slice={slice} />
    case 'AccordionSlice':
      return <AccordionSlice slice={slice} />
    default:
      return <></>
  }
}
