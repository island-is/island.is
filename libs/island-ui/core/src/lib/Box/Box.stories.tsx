import React from 'react'
import { Box } from './Box'

export default {
  title: 'Core/Box',
  component: Box,
}

export const Default = () => <Box>The Swish army knife of Treat</Box>

export const Hidden = () => {
  return (
    <>
      <Box hiddenAbove="md" background="blue200">
        I'm hidden above md (lg+)
      </Box>
      <Box hiddenBelow="md" background="red200">
        I'm hidden below md (xs, sm)
      </Box>
    </>
  )
}

export const Spacing = () => {
  return (
    <Box paddingX={2} paddingLeft={1} paddingRight={1} marginY={2}>
      I'm great for spacing
    </Box>
  )
}
