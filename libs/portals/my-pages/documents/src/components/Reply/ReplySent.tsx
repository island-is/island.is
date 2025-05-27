import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  body?: string | null
  intro?: string | null
  loading?: boolean
}

const ReplySent: React.FC<Props> = ({ body, intro, loading }) => {
  if (!body) return null
  return (
    <Box marginBottom={4}>
      <Stack space={2}>
        {intro && <AlertMessage type="info" message={intro} />}
        {loading && <LoadingDots />}
        <Box
          dangerouslySetInnerHTML={{ __html: body }}
          style={{ fontWeight: 'lighter' }}
        />
      </Stack>
    </Box>
  )
}

export default ReplySent
