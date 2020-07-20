import React, { FC } from 'react'
import { Stack, Typography } from '@island.is/island-ui/core'

export interface SectionHeadingProps {
  title: string
  intro: string
}

const SectionHeading: FC<SectionHeadingProps> = ({ title, intro }) => (
  <Stack space={3}>
    <Typography variant="h1" as="h2">
      {title}
    </Typography>
    <Typography variant="intro" as="p">
      {intro}
    </Typography>
  </Stack>
)

export default SectionHeading
