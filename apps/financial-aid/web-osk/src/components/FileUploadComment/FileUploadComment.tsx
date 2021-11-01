import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './FileUploadComment.css'

interface Props {
  comment?: string
}

const FileUploadComment = ({ comment }: Props) => {
  if (!comment) {
    return null
  }

  return (
    <Box
      background="purple100"
      paddingX={4}
      paddingY={3}
      className={styles.commentContainer}
      marginBottom={[3, 3, 5]}
    >
      <Text variant="eyebrow" marginBottom={1}>
        Athugasemd með gögnum
      </Text>
      <Text>{comment}</Text>
    </Box>
  )
}

export default FileUploadComment
