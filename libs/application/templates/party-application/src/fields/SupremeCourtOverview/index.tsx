import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { CSVLink } from 'react-csv'
import { Endorsement } from '../../types'

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

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const SupremeCourtOverview: FC<FieldBaseProps> = ({ application }) => {
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { formatMessage } = useLocale()
  const { answers } = application // todo render correct answers
  const [endorsements, setEndorsements] = useState<Endorsement[]>()

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
          <CSVLink
            data={endorsements ?? 'Engum meðmælum hefur verið skilað'}
            filename="medmaelendur.csv"
          >
            <Button variant="text" icon="download" iconType="outline">
              {formatMessage(m.supremeCourt.csvButton)}
            </Button>
          </CSVLink>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.constituencyLabel)}
          </Text>
          <Text>{answers.constituency}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default SupremeCourtOverview
