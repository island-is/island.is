import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { csvFileName } from '../../constants'
import { PartyLetter } from '../../lib/dataSchema'
import { useEndorsements } from '../../hooks/useFetchEndorsements'
import { Endorsement } from '../../types/schema'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'

const mapToCSVFile = (endorsements: Endorsement[]) => {
  return endorsements.map((endorsement) => {
    return {
      Kennitala: formatKennitala(endorsement.endorser),
      Dagssetning: format(new Date(endorsement.created), 'dd.MM.yyyy'),
      Nafn: endorsement.meta.fullName ?? '',
      Heimilisfang: endorsement.meta.address.streetAddress ?? '',
      Póstnúmer: endorsement.meta.address.postalCode ?? '',
      Borg: endorsement.meta.address.city ?? '',
    }
  })
}

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const MinistryOfJusticeOverview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const endorsementListId = (externalData?.createEndorsementList.data as any).id
  const answers = application.answers as PartyLetter
  const { endorsements } = useEndorsements(endorsementListId, false)

  return (
    <Box>
      <Text variant="h3"> {formatMessage(m.ministryOfJustice.subtitle)}</Text>
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
      <Box display="flex" marginBottom={3}>
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
          <Text marginBottom={1}>{endorsements?.length ?? 0}</Text>
        </Box>
      </Box>
      <Box marginBottom={5}>
        {endorsements?.length && (
          <ExportAsCSV
            data={mapToCSVFile(endorsements) as object[]}
            filename={csvFileName(answers.partyLetter, answers.partyName)}
            title={formatMessage(m.ministryOfJustice.csvButton)}
          />
        )}
      </Box>
    </Box>
  )
}

export default MinistryOfJusticeOverview
