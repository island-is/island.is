import React, { FC, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { CSVLink } from 'react-csv'
import { Endorsement } from '../../../../../application/templates/party-application/src/types/schema'
import { Application } from '@island.is/application/core'
import gql from 'graphql-tag'
import { useLocale } from '@island.is/localization'
import { SchemaFormValues } from '../../../../../application/templates/party-application/src/lib/dataSchema'
import { useQuery } from '@apollo/client'
import { m } from '../../../../../application/templates/party-application/src/lib/messages'

const GET_ENDORSEMENT_LIST = gql`
  query endorsementSystemGetEndorsements($input: FindEndorsementListInput!) {
    endorsementSystemGetEndorsements(input: $input) {
      id
      endorser
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`

interface ExportCSVProps {
  application: Application
}

const ExportEndorsementsAsCSV: FC<ExportCSVProps> = ({
  application
}) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as SchemaFormValues
  const [endorsements, setEndorsements] = useState<Endorsement[]>()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { loading, error } = useQuery(GET_ENDORSEMENT_LIST, {
    variables: {
      input: {
        listId: endorsementListId,
      },
    },
    onCompleted: async ({ endorsementSystemGetEndorsements }) => {
      if (!loading && endorsementSystemGetEndorsements) {
        const hasEndorsements =
          !error && !loading && endorsementSystemGetEndorsements?.length
            ? endorsementSystemGetEndorsements.length > 0
            : false
        const mapToEndorsementList: Endorsement[] = hasEndorsements
          ? endorsementSystemGetEndorsements.map((x: any) => ({
              date: x.created,
              name: x.meta.fullName,
              nationalId: x.endorser,
              address: x.meta.address ? x.meta.address : '',
              hasWarning: false,
              id: x.id,
            }))
          : undefined
        setEndorsements(mapToEndorsementList)
      }
    },
  })

  const filename = (): string => {
    const strippedPartyName = answers.partyName.toString().replace(/\s/g, '')
    const strippedPartyLetter = answers.partyLetter
      .toString()
      .replace(/\s/g, '')
    return `Meðmælendalisti-${strippedPartyName}(${strippedPartyLetter}).csv`
  }
  return (
    <Box display='flex'>
      <CSVLink
          data={
            endorsements ??
            formatMessage(m.supremeCourt.noEndorsementsMessage)
          }
          filename={filename()}
        >
        <Button variant="text" icon="download" iconType="outline">
          {formatMessage(m.supremeCourt.csvButton)}
        </Button>
      </CSVLink>
    </Box>
  )
}

export default ExportEndorsementsAsCSV
