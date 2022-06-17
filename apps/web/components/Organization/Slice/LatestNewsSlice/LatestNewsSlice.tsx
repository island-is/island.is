import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { NewsItems } from '@island.is/web/components'
import { Box, GridContainer } from '@island.is/island-ui/core'

interface SliceProps {
  slice: LatestNewsSliceSchema
  organizationPageSlug: string
}

export const LatestNewsSlice: React.FC<SliceProps> = ({
  slice,
  organizationPageSlug,
}) => {
  return (
    <Box
      component="section"
      background="purple100"
      paddingTop={[5, 5, 8]}
      paddingBottom={[2, 2, 5]}
      aria-labelledby="news-items-title"
    >
      <GridContainer>
        <NewsItems
          heading={slice.title}
          headingTitle="news-items-title"
          seeMoreText={slice.readMoreText}
          items={slice.news}
          linkType="organizationnews"
          overview="organizationnewsoverview"
          parameters={[organizationPageSlug]}
          seeMoreHref={slice.readMoreLink?.url}
        />
      </GridContainer>
    </Box>
  )
}
