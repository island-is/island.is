import React from 'react'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Logo } from '../Logo/Logo'
import { Text } from '../Text/Text'
import { Stack } from './Stack'

export default {
  title: 'Layout/Stack',
  component: Stack,
}

export const Default = () => (
  <Box paddingY={2}>
    <ContentBlock width="medium">
      <Stack space="containerGutter">
        <Text>
          Renders content horizontally with consistent spacing between all
          items, spanning multiple lines if needed. See `Inline` for a
          horizontal version.
        </Text>
        <Logo />
        <Logo />
        <Logo />
        <Logo />
        <Logo />
        <Logo />
      </Stack>
    </ContentBlock>
  </Box>
)
