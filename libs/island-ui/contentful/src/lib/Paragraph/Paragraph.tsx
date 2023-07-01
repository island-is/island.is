import React, { FC } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { simpleSpacing } from '../ContentContainer/ContentContainer'

export const Paragraph: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <Box marginBottom={simpleSpacing}>
      <Text>{children}</Text>
    </Box>
  )
}

export default Paragraph
