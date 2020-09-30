import React from 'react'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'
import { Logo } from '../Logo/Logo'
import Typography from '../Typography/Typography'
import { Stack } from './Stack'

export default {
  title: 'Core/Stack',
  component: Stack,
}

export const Default = () => (
  <Box paddingY={2}>
    <ContentBlock width="medium">
      <Stack space="containerGutter">
        <Typography>
          Renders content horizontally with consistent spacing between all
          items, spanning multiple lines if needed. See `Inline` for a
          horizontal version.
        </Typography>
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
