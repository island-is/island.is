import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

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
      <Text variant="h3">Yfirlit yfir framboðslista</Text>
      <Box display="flex" marginTop={3} marginBottom={5}>
        <Box width="half">
          <Text variant="h5">{formatMessage('Nafn flokks')}</Text>
          <Text>{'Siggu flokkur'}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">{formatMessage('Listabókstafur')}</Text>
          <Text>{'Æ'}</Text>
        </Box>
      </Box>
      <Box display="flex" marginBottom={5}>
        <Box width="half">
          <Text variant="h5">{formatMessage('Ábyrgðarmaður')}</Text>
          <Text>{'Sigríður Hrafnsdóttir'}</Text>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">{formatMessage('Tegund framboðs')}</Text>
          <Text>{'Alþingi 2021'}</Text>
        </Box>
      </Box>
      <Box display="flex">
        <Box marginBottom={3} width="half">
          <Text variant="h5">{formatMessage('Fjöldi meðmælenda')}</Text>
          <Text marginBottom={1}>{'528'}</Text>
          <Button variant="text" icon="download" iconType="outline">
            Hlaða niður atvkæðum
          </Button>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.overviewSection.constituency)}
          </Text>
          <Text>{'Suðurkjördæmi'}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default SupremeCourtOverview
