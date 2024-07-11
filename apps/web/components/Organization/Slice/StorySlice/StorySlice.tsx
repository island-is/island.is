import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { StorySlice as StorySliceProps } from '@island.is/web/graphql/schema'

import { StoryList } from '../../../StoryList/StoryList'

interface SliceProps {
  slice: StorySliceProps
}

export const StorySlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box paddingTop={[8, 8, 12]} paddingBottom={[12, 8, 10]}>
        <StoryList
          {...slice}
          stories={(slice.stories as any[]).map((story) => ({
            ...story,
            logoUrl: story.logo.url,
          }))}
          variant="dark"
        />
      </Box>
    </section>
  )
}
