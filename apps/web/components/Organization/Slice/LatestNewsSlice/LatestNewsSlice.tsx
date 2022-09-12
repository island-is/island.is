import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { NewsItems } from '@island.is/web/components'
import { Box } from '@island.is/island-ui/core'
import { LinkType } from '@island.is/web/hooks'

interface SliceProps {
  slice: LatestNewsSliceSchema
  slug: string
  renderedOnOrganizationSubpage: boolean
  linkType?: LinkType
  overview?: LinkType
}

export const LatestNewsSlice: React.FC<SliceProps> = ({
  slice,
  slug,
  renderedOnOrganizationSubpage,
  linkType = 'organizationnews',
  overview = 'organizationnewsoverview',
}) => {
  return (
    <Box
      component="section"
      background={renderedOnOrganizationSubpage ? undefined : 'purple100'}
      paddingTop={[5, 5, 8]}
      paddingBottom={[2, 2, 5]}
      aria-labelledby="news-items-title"
    >
      <NewsItems
        heading={slice.title}
        headingTitle="news-items-title"
        seeMoreText={slice.readMoreText}
        items={slice.news}
        linkType={linkType}
        overview={overview}
        parameters={[slug]}
        seeMoreHref={slice.readMoreLink?.url}
        forceTitleSectionHorizontalPadding={renderedOnOrganizationSubpage}
      />
    </Box>
  )
}
