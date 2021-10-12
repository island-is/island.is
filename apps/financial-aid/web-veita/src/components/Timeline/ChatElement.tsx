import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'

interface Props {
  eventType: ApplicationEventType
  comment?: string
}

const ChatElement = ({ eventType, comment }: Props) => {
  if (eventType !== ApplicationEventType.STAFFCOMMENT) {
    return null
  }

  return (
    <Box paddingLeft={3} marginBottom={2}>
      <Text variant="small">{comment}</Text>
    </Box>
  )
}

export default ChatElement
