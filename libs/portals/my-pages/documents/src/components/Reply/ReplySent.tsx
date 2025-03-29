import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  id: string
  intro?: string
  email: string
  reply: string
  date: Date
}

const ReplySent: React.FC<Props> = ({ id, email, reply, intro }) => {
  return (
    <Box marginTop={1}>
      {intro && <AlertMessage type="info" message={intro} />}

      <Stack space={2}>
        <Box marginTop={2}>
          <Text variant="eyebrow" color="purple400">
            Málsnúmer
          </Text>
          <Text>#{id}</Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            Send á tölvupóstfang
          </Text>
          <Text>{email}</Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            Skilaboð
          </Text>
          <Text>{reply}</Text>
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplySent
