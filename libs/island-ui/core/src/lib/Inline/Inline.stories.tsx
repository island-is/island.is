import React from 'react'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Logo } from '../Logo/Logo'
import { Text } from '../Text/Text'
import { Inline } from './Inline'

export default {
  title: 'Layout/Inline',
  component: Inline,
}

export const Default = () => (
  <Box paddingY={2}>
    <ContentBlock width="medium">
      <Inline space="containerGutter">
        <Text>
          Renders content horizontally with consistent spacing between all
          items, spanning multiple lines if needed. See `Stack` for a vertical
          version.
        </Text>
        <Logo />
        <Logo />
        <Logo />
        <Logo />
        <Logo />
        <Logo />
      </Inline>
    </ContentBlock>
  </Box>
)
