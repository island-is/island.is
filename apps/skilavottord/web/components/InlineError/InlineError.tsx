import React, { FC } from 'react'

import {
  Box,
  IconDeprecated as Icon,
  Typography,
} from '@island.is/island-ui/core'

export interface InlineErrorProps {
  message: string
}

export const InlineError: FC<InlineErrorProps> = ({
  message,
}: InlineErrorProps) => (
  <Box display="flex">
    <Box flexShrink={0} paddingRight={2}>
      <Icon type="alert" color="red400" />
    </Box>
    <Typography>{message}</Typography>
  </Box>
)

export default InlineError
