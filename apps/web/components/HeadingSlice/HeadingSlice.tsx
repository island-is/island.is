import React, { FC } from 'react'
import { Stack, Typography } from '@island.is/island-ui/core'
import { HeadingSlice as HeadingSliceType } from '@island.is/api/schema'

export const HeadingSlice: FC<HeadingSliceType> = ({ title, body }) => (
  <Stack space={3}>
    <Typography variant="h1" as="h2">
      {title}
    </Typography>
    <Typography variant="intro" as="p">
      {body}
    </Typography>
  </Stack>
)

export default HeadingSlice
