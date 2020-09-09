import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

export const Intro: FC = ({ children }) => {
  return (
    <Box marginBottom={2}>
      <Typography variant="intro" as="p">
        {children}
      </Typography>
    </Box>
  )
}

export default Intro
