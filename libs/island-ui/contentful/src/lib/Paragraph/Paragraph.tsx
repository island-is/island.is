import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import { simpleSpacing } from '../ContentContainer/ContentContainer'

export const Paragraph: FC = ({ children }) => {
  return (
    <Box marginBottom={simpleSpacing}>
      <Typography variant="p" as="p">
        {children}
      </Typography>
    </Box>
  )
}

export default Paragraph
