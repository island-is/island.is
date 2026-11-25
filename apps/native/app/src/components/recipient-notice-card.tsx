import React, { ReactNode } from 'react'
import { useTheme } from 'styled-components/native'

import { StatusMessageTemplate } from '@/ui'

/**
 * Shown in place of the compose form whenever a message can't be sent: the
 * recipient is closed, it doesn't offer messaging, or there is no recipient.
 *
 * Wraps StatusMessageTemplate, not StatusMessage: these are content states, so StatusMessage's
 * offline swap would replace an accurate explanation with a connectivity one.
 * Only a failed load uses StatusMessage.
 */
export const RecipientNoticeCard = ({
  title,
  message,
}: {
  title: string
  message: string | ReactNode
}) => {
  const theme = useTheme()

  return (
    <StatusMessageTemplate
      variant="info"
      showIcon
      paddingHorizontal={theme.spacing[3]}
      paddingVertical={theme.spacing[5]}
      title={title}
      message={message}
    />
  )
}
