import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../utils/messages'

interface Props {
  id?: string | null
  sentTo?: string | null
  body?: string | null
  date?: Date | null
  intro?: string | null
}

const ReplySent: React.FC<Props> = ({ id, sentTo, body, intro }) => {
  const { formatMessage } = useLocale()
  if (!id || !body) return null
  return (
    <Box marginTop={1} marginBottom={2}>
      {intro && <AlertMessage type="info" message={intro} />}
      <Stack space={2}>
        <Box marginTop={2}>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.caseNumber)}
          </Text>
          <Text>#{id}</Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.sentToEmail)}
          </Text>
          <Text>{sentTo}</Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.message)}
          </Text>
          <Box dangerouslySetInnerHTML={{ __html: body }} />
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplySent
