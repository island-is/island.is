import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'

interface PaymentErrorProps {
  title: string | string[]
  errorMessage: string | string[]
  buttonCaption: string | string[]
  onClick?: () => unknown
}

export const PaymentError: FC<PaymentErrorProps> = ({
  title,
  errorMessage,
  buttonCaption,
  onClick,
}) => (
  <Box>
    <Text variant="h3">{title}</Text>
    <Text marginBottom="p2">{errorMessage}</Text>
    {onClick && <Button onClick={onClick}>{buttonCaption}</Button>}
  </Box>
)
