import React from 'react'
import { useIntl } from 'react-intl'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Alert, LinkText } from '@/ui'
import arrowForward from '@/ui/assets/icons/arrow.png'

interface NotificationsPermissionAlertProps {
  titleId: string
  messageId: string
  linkTextId: string
  onPress(): void
}

/** Warns that the OS is not delivering notifications, with the way to fix it. */
export const NotificationsPermissionAlert = ({
  titleId,
  messageId,
  linkTextId,
  onPress,
}: NotificationsPermissionAlertProps) => {
  const intl = useIntl()
  const theme = useTheme()

  return (
    <Alert
      type="warning"
      size="small"
      hasBorder
      title={intl.formatMessage({ id: titleId })}
      message={intl.formatMessage({ id: messageId })}
      action={
        <TouchableOpacity onPress={onPress} accessibilityRole="button">
          <LinkText variant="small" icon={arrowForward}>
            {intl.formatMessage({ id: linkTextId })}
          </LinkText>
        </TouchableOpacity>
      }
      style={{
        marginHorizontal: theme.spacing[2],
        marginBottom: theme.spacing[2],
      }}
    />
  )
}
