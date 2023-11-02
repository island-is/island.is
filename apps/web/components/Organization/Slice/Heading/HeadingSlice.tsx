import React from 'react'
import { HeadingSlice as HeadlingSliceSchema } from '@island.is/web/graphql/schema'
import { Box } from '@island.is/island-ui/core'
import { Heading } from '@island.is/web/components'

interface SliceProps {
  slice: HeadlingSliceSchema
}

export const HeadingSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  return (
    <section key={slice.id} id={slice.id}>
      <Box paddingTop={[8, 6, 6]} paddingBottom={[4, 5, 5]}>
        <Heading {...slice} />
      </Box>
    </section>
  )
}
