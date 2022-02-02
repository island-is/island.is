import { Text } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'

interface ForwardToPaymentFlowProps {
  url: string
  message: string
}

export const ForwardToPaymentFlow: FC<ForwardToPaymentFlowProps> = ({
  url,
  message,
}) => {
  useEffect(() => {
    window.document.location.href = url
  }, [url])

  return <Text>{message}</Text>
}
