import {
  AlertMessage,
  Box,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  /** The main body content of the reply message. If null/undefined, component returns null */
  body?: string | null
  /**
   * Optional intro message displayed as an info alert above the body.
   * Typically used for first-time reply confirmations with email and case number info.
   */
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
        <Box style={{ fontWeight: 'lighter', whiteSpace: 'pre-line' }}>
          {body}
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplySent
