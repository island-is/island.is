import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

interface Props {
  isVisable: boolean
  comment?: string
}

const StaffComment = ({ isVisable, comment }: Props) => {
  if (!isVisable) {
    return null
  }

  return (
    <Box paddingLeft={3} marginBottom={2}>
      <Text variant="small">{comment}</Text>
    </Box>
  )
}

export default StaffComment
