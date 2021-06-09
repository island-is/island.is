import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { csvFileName } from '../../constants'
import { PartyLetter } from '../../lib/dataSchema'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const PartyLetterApplicationApprovedOverview: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = (application as any).answers as PartyLetter

  return (
    <Box>
      <Text variant="h3">
        {formatMessage(m.partyLetterApprovedOverview.subtitle)}
      </Text>
      <Box display="flex" marginTop={3} marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.ministryOfJustice.partyNameLabel)}
          </Text>
          <Text>{answers.partyName}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.ministryOfJustice.partyLetterLabel)}
          </Text>
          <Text>{answers.partyLetter}</Text>
        </Box>
      </Box>
      <Box display="flex" marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.ministryOfJustice.responsiblePersonLabel)}
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
            {formatMessage(m.ministryOfJustice.numberOfEndorsementsLabel)}
          </Text>
          <Text>{'528'}</Text>
        </Box>
      </Box>
      <Box display="flex">
       {/* <ExportAsCSV
          data={answers.endorsements as any[]}
          filename={csvFileName(answers.partyLetter, answers.partyName)}
          title={formatMessage(m.ministryOfJustice.csvButton)}
       />*/}
      </Box>
    </Box>
  )
}

export default PartyLetterApplicationApprovedOverview
