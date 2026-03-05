import { useIntl } from 'react-intl'

import { Box, Stack, Tag, Text } from '@island.is/island-ui/core'

import { m } from '../../messages/messages'

interface ProgrammeHeaderProps {
  title?: string | null
  ministrySerial?: string | null
  studyTrackName?: string | null
  credits?: number | null
  qualificationLevel?: string | null
  specializationTitle?: string | null
}

export const ProgrammeHeader = ({
  title,
  ministrySerial,
  studyTrackName,
  credits,
  qualificationLevel,
  specializationTitle,
}: ProgrammeHeaderProps) => {
  const { formatMessage } = useIntl()

  return (
    <Stack space={3}>
      <Box>
        <Text variant="h1" as="h2">
          {title || formatMessage(m.details.unknownProgramme)}
        </Text>
        {ministrySerial && (
          <Text variant="small" color="dark300">
            {formatMessage(m.details.identifierCode)}: {ministrySerial}
          </Text>
        )}
      </Box>

      <Box display="flex" flexWrap="wrap" style={{ gap: '0.5rem' }}>
        {studyTrackName && (
          <Tag disabled variant="blue">
            {studyTrackName}
          </Tag>
        )}
        {credits && (
          <Tag disabled variant="blue">
            {credits} {formatMessage(m.details.credits)}
          </Tag>
        )}
        {qualificationLevel && (
          <Tag disabled variant="blue">
            {qualificationLevel}
          </Tag>
        )}
        {specializationTitle && (
          <Tag disabled variant="blue">
            {specializationTitle}
          </Tag>
        )}
      </Box>
    </Stack>
  )
}
