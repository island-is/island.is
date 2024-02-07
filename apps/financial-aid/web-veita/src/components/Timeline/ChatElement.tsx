import React from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import * as styles from '../History/History.css'

interface Props {
  comment?: string
}

const ChatElement = ({ comment }: Props) => {
  if (!comment) {
    return null
  }

  return (
    <Box marginBottom={2} className={styles.timelineMessages}>
      <Icon icon="chatbubble" type="outline" />
      <Text whiteSpace="breakSpaces">
        „<span dangerouslySetInnerHTML={{ __html: comment }}></span>“
      </Text>
    </Box>
  )
}

export default ChatElement
