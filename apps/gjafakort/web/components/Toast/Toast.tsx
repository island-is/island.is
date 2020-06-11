import React, { useEffect, useState } from 'react'

import {
  Box,
  Columns,
  Column,
  Icon,
  Typography,
} from '@island.is/island-ui/core'

import { NotificationService } from '../../services'
import { useI18n } from '../../i18n'

interface NotificationError {
  type?: 'success' | 'info' | 'warning' | 'error'
  message?: string
}

function Toast() {
  const {
    t: { error: t },
  } = useI18n()
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
            <Typography variant="h4">{t.title}</Typography>
          </Box>
          <Typography variant="p">{notification.message}</Typography>
        </Column>
        <Column width="content">
          <Box
            alignItems="right"
            marginLeft={2}
            display="flex"
            cursor="pointer"
            onClick={handleClose}
          >
            <Icon type="close" color="dark200" />
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default Toast
