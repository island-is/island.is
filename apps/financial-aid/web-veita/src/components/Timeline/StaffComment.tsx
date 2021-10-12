import React from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'

import * as styles from '../History/History.treat'

interface Props {
  eventType: ApplicationEventType
  comment?: string
}

const ChatBubble = ({ eventType, comment }: Props) => {
  if (
    eventType !== ApplicationEventType.FILEUPLOAD &&
    eventType !== ApplicationEventType.DATANEEDED
  ) {
    return null
  }

  return (
    <Box paddingLeft={3} marginBottom={2} className={styles.timelineMessages}>
      {comment && (
        <>
          <Icon icon="chatbubble" type="outline" />{' '}
          <Text marginBottom={2}>„{comment}“</Text>
        </>
      )}
    </Box>
  )
}

export default ChatBubble
