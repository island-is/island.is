import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../utils/messages'

interface Props {
  id: string
  intro?: string
  email: string
  reply: string
  date: Date
}

const ReplyBody: React.FC<Props> = ({ id, email, reply, intro }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={1}>
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
          <Text>{email}</Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.message)}
          </Text>
          <Text>{reply}</Text>
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplyBody
