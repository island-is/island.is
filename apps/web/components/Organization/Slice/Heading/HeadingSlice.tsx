import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { Heading } from '@island.is/web/components'
import { HeadingSlice as HeadlingSliceSchema } from '@island.is/web/graphql/schema'

interface SliceProps {
  slice: HeadlingSliceSchema
}

export const HeadingSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  return (
    <section key={slice.id} id={slice.id}>
      <Box>
        <Heading {...slice} />
      </Box>
    </section>
  )
}
