import React, { useEffect, useState } from 'react'

import {
  Box,
  Columns,
  Column,
  Text,
  Icon,
  IconMapIcon,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

import { NotificationService } from '../../services'

interface NotificationStatus {
  type: 'success' | 'info' | 'warning' | 'error' | undefined
  message?: {
    title?: string
    text?: string
    timeout?: number
  }
}

interface TypeConfItems {
  error: {
    background: Colors
    iconColor: Colors
    borderColor: Colors
    icon: IconMapIcon
  }
  success: {
    background: Colors
    iconColor: Colors
    borderColor: Colors
    icon: IconMapIcon
  }
  info: {
    background: Colors
    iconColor: Colors
    borderColor: Colors
    icon: IconMapIcon
  }
  warning: {
    background: Colors
    iconColor: Colors
    borderColor: Colors
    icon: IconMapIcon
  }
}

function Toast() {
  const [notification, setNotification] = useState({
    type: undefined,
    message: {
      title: '',
      text: '',
    },
  } as NotificationStatus)

  useEffect(() => {
    const subscription = NotificationService.subscribe((status: string) => {
      console.log(status)
      setNotification((status as unknown) as NotificationStatus)
    })

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

  if (!notification.message?.text && !notification.message?.text) {
    return null
  }

  //TODO: add bordercolor to Box
  const typeConf: TypeConfItems = {
    error: {
      background: 'red100',
      iconColor: 'red400',
      borderColor: 'red200',
      icon: 'warning',
    },
    success: {
      background: 'mint100',
      iconColor: 'mint600',
      borderColor: 'mint200',
      icon: 'checkmark',
    },
    info: {
      background: 'blue100',
      iconColor: 'blue600',
      borderColor: 'blue200',
      icon: 'informationCircle',
    },
    warning: {
      background: 'yellow100',
      iconColor: 'yellow600',
      borderColor: 'yellow200',
      icon: 'warning',
    },
  }
  const conf = typeConf[notification.type ?? 'info']

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
              <Icon icon={conf.icon} color={conf.iconColor} />
            </Box>
          </Column>
          <Column>
            <Box marginBottom={1}>
              <Text variant="h4">{notification.message.title}</Text>
            </Box>
            <Text>{notification.message.text}</Text>
          </Column>
          <Column width="content">
            <Box
              marginLeft={2}
              display="flex"
              cursor="pointer"
              onClick={handleClose}
            >
              <Icon icon="close" color="dark200" />
            </Box>
          </Column>
        </Columns>
      </Box>
    </Box>
  )
}

export default Toast
