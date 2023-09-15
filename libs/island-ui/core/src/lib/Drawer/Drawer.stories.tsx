import React from 'react'

import { Button } from '../Button/Button'
import { withFigma } from '../../utils/withFigma'
import { Drawer } from './Drawer'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'

export default {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: withFigma('Drawer'),
}

export const Default = () => {
  return (
    <Drawer
      baseId="demo_drawer"
      ariaLabel="Use aria-label to explain what this is doing"
      disclosure={<Button variant="primary">Open drawer</Button>}
    >
      Hello world!
    </Drawer>
  )
}

export const PositionLeft = () => (
  <Drawer
    baseId="demo_drawer2"
    ariaLabel="Use aria-label to explain what this is doing"
    position="left"
    disclosure={<Button variant="primary">Open drawer on the left side</Button>}
  >
    Hello world!
  </Drawer>
)

export const OverflowScroll = () => (
  <Drawer
    baseId="demo_drawer3"
    ariaLabel="Use aria-label to explain what this is doing"
    disclosure={<Button variant="primary">Open overflowing drawer</Button>}
  >
    <Stack space={3}>
      {[...Array.from({ length: 20 })].map((_, i) => (
        <Box key={i} padding={3} background="blue100" borderRadius="large">
          Content box {i + 1}
        </Box>
      ))}
    </Stack>
  </Drawer>
)
