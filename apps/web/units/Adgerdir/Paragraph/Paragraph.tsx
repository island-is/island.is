import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

export const Paragraph: FC = ({ children }) => {
  return (
    <Box marginBottom={2}>
      <Text>{children}</Text>
    </Box>
  )
}

export default Paragraph
