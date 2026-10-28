import React from 'react'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { HoverTooltip } from './HoverTooltip'

export default {
  title: 'Components/HoverTooltip',
  component: HoverTooltip,
}

export const Default = () => (
  <Box padding={5}>
    <Text variant="p" as="span">
      Hover{' '}
      <HoverTooltip text="3r-74694-6674455641">
        <span>this text</span>
      </HoverTooltip>{' '}
      to reveal the full value.
    </Text>
  </Box>
)

export const Placements = () => (
  <Box padding={10} display="flex" columnGap={5}>
    {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
      <HoverTooltip key={placement} text={placement} placement={placement}>
        <span>{placement}</span>
      </HoverTooltip>
    ))}
  </Box>
)
