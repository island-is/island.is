import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { SchemaFormValues } from '../../lib/dataSchema'
import { ExportEndorsementsAsCSV } from '@island.is/application/ui-components'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const PartyApplicationApprovedOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers as SchemaFormValues

  return (
    <>
      <Box marginTop={3} display="flex">
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.responsiblePersonLabel)}
          </Text>
          <Text>
            {
              (externalData.nationalRegistry?.data as {
                fullName?: string
              })?.fullName
            }
          </Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.typeOfEndorsementLabel)}
          </Text>
          <Text>{'Alþingi 2021'}</Text>
        </Box>
      </Box>
      <Box marginTop={3} display='flex'>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.overviewSection.constituency)}
          </Text>
          <Text>{answers.constituency}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.overviewSection.signatureCount)}
          </Text>
          <Text>{answers.endorsements ? answers.endorsements.length : 0}</Text>
        </Box>
      </Box>
      <Box marginTop={3} display='flex'>
        <ExportEndorsementsAsCSV application={application} />
      </Box>
    </>
  )
}

export default PartyApplicationApprovedOverview
