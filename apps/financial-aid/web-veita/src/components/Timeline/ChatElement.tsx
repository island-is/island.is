import React from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import * as styles from '../History/History.css'

interface Props {
  isVisable: boolean
  comment?: string
}

const ChatElement = ({ isVisable, comment }: Props) => {
  if (!isVisable) {
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

export default ChatElement
