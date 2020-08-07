import React, { FC } from 'react'
import { Stack, Typography } from '@island.is/island-ui/core'

export interface HeadingProps {
  title: string
  body?: string
}

export const Heading: FC<HeadingProps> = ({ title, body }) => (
  <Stack space={3}>
    <Typography variant="h1" as="h2">
      {title}
    </Typography>
    <Typography variant="intro" as="p">
      {body}
    </Typography>
  </Stack>
)

export default Heading
