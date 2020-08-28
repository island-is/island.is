import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import {
  ContentContainer,
  simpleSpacing,
} from '../ContentContainer/ContentContainer'

export const Paragraph: FC = ({ children }) => {
  return (
    <ContentContainer paddingX="none">
      <Box marginBottom={simpleSpacing}>
        <Typography variant="p" as="p">
          {children}
        </Typography>
      </Box>
    </ContentContainer>
  )
}

export default Paragraph
