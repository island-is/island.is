import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { SIGNATURES } from '../EndorsementList'
import { useLocale } from '@island.is/localization'
import { CSVLink } from 'react-csv'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const SupremeCourtOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  console.log(answers)
  return (
    <Box>
      <Text variant="h3"> {formatMessage(m.supremeCourt.subtitle)}</Text>
      <Box display="flex" marginTop={3} marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyNameLabel)}
          </Text>
          <Text>{'Siggu flokkur'}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyLetterLabel)}
          </Text>
          <Text>{'Æ'}</Text>
        </Box>
      </Box>
      <Box display="flex" marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.responsiblePersonLabel)}
          </Text>
          <Text>{'Sigríður Hrafnsdóttir'}</Text>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.typeOfEndorsementLabel)}
          </Text>
          <Text>{'Alþingi 2021'}</Text>
        </Box>
      </Box>
      <Box display="flex">
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.numberOfEndorsementsLabel)}
          </Text>
          <Text marginBottom={1}>{'528'}</Text>
          <CSVLink data={SIGNATURES} filename="medmaelendur.csv">
            <Button variant="text" icon="download" iconType="outline">
              {formatMessage(m.supremeCourt.csvButton)}
            </Button>
          </CSVLink>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.constituencyLabel)}
          </Text>
          <Text>{'Suðurkjördæmi'}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default SupremeCourtOverview
