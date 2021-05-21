import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
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
  const { answers, externalData } = application // todo render correct answers
  console.log(application)
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

  const filename = (): string => {
    const strippedPartyName = answers.partyName.toString().replace(/\s/g, '')
    const strippedPartyLetter = answers.partyLetter
      .toString()
      .replace(/\s/g, '')
    return `Meðmælendalisti-${strippedPartyName}(${strippedPartyLetter}).csv`
  }

  return (
    <Box>
      <Text variant="h3"> {formatMessage(m.supremeCourt.subtitle)}</Text>
      <Box display="flex" marginTop={3} marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyNameLabel)}
          </Text>
          <Text>{answers.partyName}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyLetterLabel)}
          </Text>
          <Text>{answers.partyLetter}</Text>
        </Box>
      </Box>
      <Box display="flex" marginBottom={5}>
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
