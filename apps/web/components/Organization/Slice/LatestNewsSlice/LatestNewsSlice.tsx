import React from 'react'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { NewsItems } from '@island.is/web/components'
import { Box, BoxProps } from '@island.is/island-ui/core'
import { LinkType } from '@island.is/web/hooks'

interface SliceProps {
  slice: LatestNewsSliceSchema
  slug: string
  linkType?: LinkType
  overview?: LinkType
  latestNewsSliceBackground?: BoxProps['background']
  latestNewsSliceColorVariant?: 'default' | 'blue'
  forceTitleSectionHorizontalPadding?: boolean
}

export const LatestNewsSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
  slug,
  linkType = 'organizationnews',
  overview = 'organizationnewsoverview',
  latestNewsSliceBackground = 'purple100',
  latestNewsSliceColorVariant = 'default',
  forceTitleSectionHorizontalPadding = false,
}) => {
  return (
    <Box
      component="section"
      background={latestNewsSliceBackground}
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
        forceTitleSectionHorizontalPadding={forceTitleSectionHorizontalPadding}
        colorVariant={latestNewsSliceColorVariant}
      />
    </Box>
  )
}
