import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  body?: string | null
  intro?: string | null
}

const ReplySent: React.FC<Props> = ({ body, intro }) => {
  if (!body) return null
  return (
    <Box marginBottom={4}>
      <Stack space={2}>
        {intro && <AlertMessage type="info" message={intro} />}
        <Box
          dangerouslySetInnerHTML={{ __html: body }}
          style={{ fontWeight: 'lighter' }}
        />
      </Stack>
    </Box>
  )
}

export default ReplySent
