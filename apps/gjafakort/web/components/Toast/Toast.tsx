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

// TODO: change this to push service (ability to show queue of multiple toasts) and add optional timer

interface NotificationStatus {
  type?: 'success' | 'info' | 'warning' | 'error'
  message?: {
    title?: string
    text?: string
    timeout?: number
  }
}

function Toast() {
  const {
    t: { error: t },
  } = useI18n()
  const [notification, setNotification] = useState({
    type: undefined,
    message: {
      title: '',
      text: '',
    },
  } as NotificationStatus)

  useEffect(() => {
    const subscription = NotificationService.subscribe(
      (status: NotificationStatus) => {
        setNotification(status)
      },
    )

    return () => {
      NotificationService.unsubscribe(subscription)
    }
  }, [setNotification])

  const handleClose = () =>
    setNotification({
      type: undefined,
      message: {
        title: '',
        text: '',
      },
    })

  if (!notification.message.text && !notification.message.text) {
    return null
  }

  //TODO: add bordercolor to Box
  const typeConf = {
    error: {
      background: 'red100',
      iconColor: 'red400',
      borderColor: 'red200',
      icon: 'alert',
    },
    success: {
      background: 'mint100',
      iconColor: 'mint600',
      borderColor: 'mint200',
      icon: 'check',
    },
  }
  const conf = typeConf[notification.type]

  return (
    <Box position="fixed" top={20} right={0}>
      <Box
        background={conf.background}
        marginRight={4}
        marginTop={3}
        padding={[2, 2, 3]}
        borderRadius="large"
        role="status"
      >
        <Columns>
          <Column width="content">
            <Box marginRight={2} marginTop={1}>
              <Icon type={conf.icon} color={conf.iconColor} />
            </Box>
          </Column>
          <Column>
            <Box marginBottom={1}>
              <Typography variant="h4">{notification.message.title}</Typography>
            </Box>
            <Typography variant="p">{notification.message.text}</Typography>
          </Column>
          <Column width="content">
            <Box
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
    </Box>
  )
}

export default Toast
