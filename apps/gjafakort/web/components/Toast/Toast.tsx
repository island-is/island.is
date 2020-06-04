import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  ContentBlock,
  Columns,
  Column,
  Icon,
  Typography,
  theme,
} from '@island.is/island-ui/core'

import { NotificationService } from '../../services'

interface NotificationError {
  type?: 'success' | 'info' | 'warning' | 'error'
  message?: string
}

function Toast() {
  const [notification, setNotification] = useState({
    type: undefined,
    message: '',
  } as NotificationError)

  useEffect(() => {
    const subscription = NotificationService.subscribe(
      (error: NotificationError) => {
        setNotification({ type: error.type, message: error.message })
      },
    )

    return () => {
      NotificationService.unsubscribe(subscription)
    }
  }, [setNotification])

  const handleClose = () => setNotification({ type: undefined, message: '' })

  if (!notification.message) {
    return null
  }

  return (
    <Box
      position="absolute"
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
            <Icon type="alert" color={theme.color.red400} />
          </Box>
        </Column>
        <Column>
          <Box marginBottom={1}>
            <Typography variant="h4">Villa kom upp!</Typography>
          </Box>
          <Typography variant="p">{notification.message}</Typography>
        </Column>
        <Column width="content">
          <Box
            alignItems="right"
            display="flex"
            cursor="pointer"
            onClick={handleClose}
          >
            <Icon type="close" color={theme.color.dark200} />
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default Toast
