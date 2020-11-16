import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

export const Intro: FC = ({ children }) => {
  return (
    <Box marginBottom={2}>
      <Text variant="intro" as="p">
        {children}
      </Text>
    </Box>
  )
}

export default Intro
