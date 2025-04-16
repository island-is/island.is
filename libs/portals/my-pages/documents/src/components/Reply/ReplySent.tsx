import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../utils/messages'

interface Props {
  id?: string | null
  body?: string | null
  date?: Date | null
  intro?: string | null
}

const ReplySent: React.FC<Props> = ({ id, body, intro }) => {
  const { formatMessage } = useLocale()
  if (!id || !body) return null
  return (
    <Box>
      {intro && <AlertMessage type="info" message={intro} />}
      <Stack space={2}>
        <Box marginTop={2}>
          <Text variant="eyebrow" color="purple400" marginBottom={1}>
            {formatMessage(messages.caseNumber)}
          </Text>
          <Text>#{id}</Text>
        </Box>
        <Box marginBottom={2}>
          <Text variant="eyebrow" color="purple400" marginBottom={1}>
            {formatMessage(messages.message)}
          </Text>
          <Box
            dangerouslySetInnerHTML={{ __html: body }}
            style={{ fontWeight: 'lighter' }}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ReplySent
