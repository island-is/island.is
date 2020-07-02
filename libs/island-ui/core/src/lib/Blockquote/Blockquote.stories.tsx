import React from 'react'
import { Blockquote, Box } from '../..'

export default {
  title: 'Components/Blockquote',
  component: Blockquote,
}

export const Basic = () => {
  return (
    <Box padding={2}>
      <Blockquote>Here is a blockquote</Blockquote>
    </Box>
  )
}
