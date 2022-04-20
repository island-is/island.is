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
    <Box paddingLeft={3} marginBottom={2} className={styles.timelineMessages}>
      <Icon icon="chatbubble" type="outline" />{' '}
      <Text marginBottom={2}>„{comment}“</Text>
    </Box>
  )
}

export default ChatElement
