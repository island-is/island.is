import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

export const Paragraph: FC = ({ children }) => {
  return (
    <Box marginBottom={2}>
      <Typography variant="p">{children}</Typography>
    </Box>
  )
}

export default Paragraph
