import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import {
  LatestNewsSection,
  NewsItems,
  Section,
} from '@island.is/web/components'
import { Box } from '@island.is/island-ui/core'

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
      paddingTop={[5, 5, 8]}
      paddingBottom={[2, 2, 5]}
      aria-labelledby="categories-title"
    >
      <NewsItems
        heading={slice.title}
        headingTitle="news-items-title"
        seeMoreText={slice.readMoreText}
        items={slice.news}
        linkType="organizationnews"
        overview="organizationnewsoverview"
        parameters={[organizationPageSlug]}
      />
    </Box>
  )
}
