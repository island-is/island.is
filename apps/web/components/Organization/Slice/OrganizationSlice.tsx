import React, { FC } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import { Namespace } from '@island.is/api/schema'
import dynamic from 'next/dynamic'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'

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

const TimelineSlice = dynamic(() =>
  import('@island.is/web/components').then((mod) => mod.TimelineSlice),
)
interface OrganizationSliceProps {
  slice: Slice
  namespace?: Namespace
  fullWidth?: boolean
}

const fullWidthSlices = ['TimelineSlice']

const renderSlice = (slice, namespace) => {
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
    case 'AccordionSlice':
      return <AccordionSlice slice={slice} />
    case 'TimelineSlice':
      return <TimelineSlice slice={slice} />
    default:
      return <></>
  }
}

export const OrganizationSlice: FC<OrganizationSliceProps> = ({
  slice,
  namespace,
  fullWidth = false,
}) => (
  <GridContainer>
    {console.log({
      fullWidth,
      test: fullWidthSlices.includes(slice.__typename),
    })}
    <GridRow>
      <GridColumn
        paddingTop={6}
        span={
          fullWidthSlices.includes(slice.__typename) || !fullWidth
            ? '9/9'
            : ['9/9', '9/9', '7/9']
        }
        offset={
          fullWidthSlices.includes(slice.__typename) || !fullWidth
            ? '0'
            : ['0', '0', '1/9']
        }
      >
        {renderSlice(slice, namespace)}
      </GridColumn>
    </GridRow>
  </GridContainer>
)
