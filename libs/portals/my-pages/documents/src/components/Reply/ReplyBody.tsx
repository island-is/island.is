import { Box } from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  id?: string | null
  sentTo?: string | null
  body?: string | null
  date?: Date | null
  intro?: string | null
}

const ReplyBody: React.FC<Props> = ({ id, body }) => {
  if (!id || !body) return null
  return (
    <Box marginTop={1}>
      <Box dangerouslySetInnerHTML={{ __html: body }} />
    </Box>
  )
}

export default ReplyBody
