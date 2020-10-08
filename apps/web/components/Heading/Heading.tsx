import React, { FC } from 'react'
import { Stack, Text } from '@island.is/island-ui/core'

export interface HeadingProps {
  title: string
  body: string
}

export const Heading: FC<HeadingProps> = ({ title, body }) => (
  <Stack space={3}>
    <Text variant="h1" as="h2">
      {title}
    </Text>
    <Text variant="intro" as="p">
      {body}
    </Text>
  </Stack>
)

export default Heading
