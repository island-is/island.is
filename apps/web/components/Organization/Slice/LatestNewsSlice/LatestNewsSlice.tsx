import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { NewsItems } from '@island.is/web/components'
import { Box } from '@island.is/island-ui/core'

interface SliceProps {
  slice: LatestNewsSliceSchema
  organizationPageSlug: string
  renderedOnOrganizationSubpage: boolean
}

export const LatestNewsSlice: React.FC<SliceProps> = ({
  slice,
  organizationPageSlug,
  renderedOnOrganizationSubpage,
}) => {
  return (
    <Box
      component="section"
      background="purple100"
      paddingTop={[5, 5, 8]}
      paddingBottom={[2, 2, 5]}
      aria-labelledby="news-items-title"
    >
      <NewsItems
        heading={slice.title}
        headingTitle="news-items-title"
        seeMoreText={slice.readMoreText}
        items={slice.news}
        linkType="organizationnews"
        overview="organizationnewsoverview"
        parameters={[organizationPageSlug]}
        seeMoreHref={slice.readMoreLink?.url}
        forceTitleSectionHorizontalPadding={renderedOnOrganizationSubpage}
      />
    </Box>
  )
}
