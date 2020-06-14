import React from 'react'

import {
  Box,
  Columns,
  Column,
  Icon,
  Typography,
} from '@island.is/island-ui/core'

export interface ErrorPanelProps {
  title?: string
  message?: string
}

export const ErrorPanel = ({ title, message }: ErrorPanelProps) => {
  return (
    <Box
      position="fixed"
      background="red100"
      top={20}
      right={0}
      margin={4}
      padding={[2, 2, 3]}
      border="focus"
      borderRadius="large"
    >
      <Columns>
        <Column width="content">
          <Box marginRight={2} alignItems="center" display="flex">
            <Icon type="alert" color="red400" />
          </Box>
        </Column>
        <Column>
          <Box marginBottom={1}>
            <Typography variant="h4">{title}</Typography>
          </Box>
          <Typography variant="p">{message}</Typography>
        </Column>
      </Columns>
    </Box>
  )
}

export default ErrorPanel
