import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { PartyLetterRegistryPartyLetter } from '../../dataProviders/partyLetterRegistry'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const ReviewConstituency: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers, externalData } = application

  const party: PartyLetterRegistryPartyLetter = externalData
    ?.partyLetterRegistry?.data as PartyLetterRegistryPartyLetter

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.partyletter)}</Text>
        <Text>{party.partyLetter}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.party)}</Text>
        <Text>{party.partyName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.responsiblePerson)}
        </Text>
        <Text>
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.constituency)}
        </Text>
        <Text>{answers.constituency}</Text>
      </Box>
    </>
  )
}

export default ReviewConstituency
