import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { Heading } from '@island.is/web/components'
import { HeadingSlice as HeadlingSliceSchema } from '@island.is/web/graphql/schema'

interface SliceProps {
  slice: HeadlingSliceSchema
}

export const HeadingSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id}>
      <Box paddingTop={[8, 6, 6]} paddingBottom={[4, 5, 5]}>
        <Heading {...slice} />
      </Box>
    </section>
  )
}
